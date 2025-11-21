const { Order, OrderItem, Product, User, Payment, Shipment } = require('../models');
const sequelize = require('../db');

class OrderService {
  /**
   * Get all orders dengan pagination
   */
  async getAllOrders(userId = null, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const where = userId ? { user_id: userId } : {};
    
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] },
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: Payment, as: 'payment' },
        { model: Shipment, as: 'shipment' }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return {
      orders: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId, userId = null) {
    const where = { id: orderId };
    if (userId) where.user_id = userId;
    
    const order = await Order.findOne({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'phone'] },
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: Payment, as: 'payment' },
        { model: Shipment, as: 'shipment' }
      ]
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  }

  /**
   * Create order dari cart
   */
  async createOrder(userId, orderData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { items, payment_method, shipping_cost = 20000 } = orderData;
      
      // Hitung total
      let total_amount = 0;
      const orderItems = [];
      
      for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }
        
        const itemTotal = product.price * item.quantity;
        total_amount += itemTotal;
        
        orderItems.push({
          product_id: product.id,
          product_name_snapshot: product.name,
          price_snapshot: product.price,
          quantity: item.quantity
        });
        
        // Update stock
        await product.update(
          { stock: product.stock - item.quantity },
          { transaction }
        );
      }
      
      // Create order
      const order = await Order.create({
        user_id: userId,
        status: 'pending',
        total_amount,
        shipping_cost,
        payment_method
      }, { transaction });
      
      // Create order items
      for (const item of orderItems) {
        await OrderItem.create({
          order_id: order.id,
          ...item
        }, { transaction });
      }
      
      await transaction.commit();
      
      return await this.getOrderById(order.id, userId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId, status) {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    await order.update({ status });
    
    return await this.getOrderById(orderId);
  }

  /**
   * Create payment for order
   */
  async createPayment(orderId, paymentData) {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    const payment = await Payment.create({
      order_id: orderId,
      provider: paymentData.provider,
      status: 'paid',
      transaction_id: paymentData.transaction_id,
      amount: order.total_amount + order.shipping_cost,
      paid_at: new Date()
    });
    
    // Update order status
    await order.update({ status: 'paid' });
    
    return payment;
  }

  /**
   * Create shipment for order
   */
  async createShipment(orderId, shipmentData) {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    const shipment = await Shipment.create({
      order_id: orderId,
      courier: shipmentData.courier,
      tracking_number: shipmentData.tracking_number,
      status: 'waiting_pickup'
    });
    
    return shipment;
  }

  /**
   * Update shipment status
   */
  async updateShipmentStatus(orderId, status) {
    const shipment = await Shipment.findOne({ where: { order_id: orderId } });
    
    if (!shipment) {
      throw new Error('Shipment not found');
    }
    
    const updateData = { status };
    
    if (status === 'shipped' && !shipment.shipped_at) {
      updateData.shipped_at = new Date();
    }
    
    if (status === 'delivered') {
      updateData.delivered_at = new Date();
      
      // Update order status
      const order = await Order.findByPk(orderId);
      await order.update({ status: 'delivered' });
    }
    
    await shipment.update(updateData);
    
    return shipment;
  }
}

module.exports = new OrderService();