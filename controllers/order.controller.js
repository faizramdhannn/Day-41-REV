const orderService = require('../services/order.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

class OrderController {
  /**
   * Get all orders
   */
  async getAllOrders(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user ? req.user.id : null;
      
      const result = await orderService.getAllOrders(userId, parseInt(page), parseInt(limit));
      
      return paginatedResponse(
        res,
        result.orders,
        { page: result.page, limit: result.limit, total: result.total },
        'Orders retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : null;
      
      const order = await orderService.getOrderById(id, userId);
      
      return successResponse(res, order, 'Order retrieved successfully');
    } catch (error) {
      if (error.message === 'Order not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Create order
   */
  async createOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const orderData = req.body;
      
      const order = await orderService.createOrder(userId, orderData);
      
      return successResponse(res, order, 'Order created successfully', 201);
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('Insufficient stock')) {
        return errorResponse(res, error.message, 400);
      }
      next(error);
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const order = await orderService.updateOrderStatus(id, status);
      
      return successResponse(res, order, 'Order status updated successfully');
    } catch (error) {
      if (error.message === 'Order not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Create payment
   */
  async createPayment(req, res, next) {
    try {
      const { id } = req.params;
      const paymentData = req.body;
      
      const payment = await orderService.createPayment(id, paymentData);
      
      return successResponse(res, payment, 'Payment created successfully', 201);
    } catch (error) {
      if (error.message === 'Order not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Create shipment
   */
  async createShipment(req, res, next) {
    try {
      const { id } = req.params;
      const shipmentData = req.body;
      
      const shipment = await orderService.createShipment(id, shipmentData);
      
      return successResponse(res, shipment, 'Shipment created successfully', 201);
    } catch (error) {
      if (error.message === 'Order not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Update shipment status
   */
  async updateShipmentStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const shipment = await orderService.updateShipmentStatus(id, status);
      
      return successResponse(res, shipment, 'Shipment status updated successfully');
    } catch (error) {
      if (error.message === 'Shipment not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }
}

module.exports = new OrderController();