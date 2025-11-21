const { Cart, CartItem, Product } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

class CartController {
  /**
   * Get user cart
   */
  async getCart(req, res, next) {
    try {
      const userId = req.user.id;
      
      let cart = await Cart.findOne({
        where: { user_id: userId },
        include: [
          {
            model: CartItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                include: ['category', 'brand', 'media']
              }
            ]
          }
        ]
      });
      
      // Create cart if not exists
      if (!cart) {
        cart = await Cart.create({ user_id: userId });
        cart.items = [];
      }
      
      return successResponse(res, cart, 'Cart retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { product_id, quantity = 1 } = req.body;
      
      // Check product exists
      const product = await Product.findByPk(product_id);
      if (!product) {
        return errorResponse(res, 'Product not found', 404);
      }
      
      // Check stock
      if (product.stock < quantity) {
        return errorResponse(res, 'Insufficient stock', 400);
      }
      
      // Get or create cart
      let cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        cart = await Cart.create({ user_id: userId });
      }
      
      // Check if item already in cart
      let cartItem = await CartItem.findOne({
        where: { cart_id: cart.id, product_id }
      });
      
      if (cartItem) {
        // Update quantity
        const newQuantity = cartItem.quantity + quantity;
        if (product.stock < newQuantity) {
          return errorResponse(res, 'Insufficient stock', 400);
        }
        await cartItem.update({ quantity: newQuantity });
      } else {
        // Create new cart item
        cartItem = await CartItem.create({
          cart_id: cart.id,
          product_id,
          quantity
        });
      }
      
      // Return updated cart
      const updatedCart = await Cart.findOne({
        where: { user_id: userId },
        include: [
          {
            model: CartItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                include: ['category', 'brand', 'media']
              }
            ]
          }
        ]
      });
      
      return successResponse(res, updatedCart, 'Item added to cart successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(req, res, next) {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;
      const { quantity } = req.body;
      
      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        return errorResponse(res, 'Cart not found', 404);
      }
      
      const cartItem = await CartItem.findOne({
        where: { id: itemId, cart_id: cart.id },
        include: [{ model: Product, as: 'product' }]
      });
      
      if (!cartItem) {
        return errorResponse(res, 'Cart item not found', 404);
      }
      
      // Check stock
      if (cartItem.product.stock < quantity) {
        return errorResponse(res, 'Insufficient stock', 400);
      }
      
      await cartItem.update({ quantity });
      
      // Return updated cart
      const updatedCart = await Cart.findOne({
        where: { user_id: userId },
        include: [
          {
            model: CartItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                include: ['category', 'brand', 'media']
              }
            ]
          }
        ]
      });
      
      return successResponse(res, updatedCart, 'Cart item updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;
      
      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        return errorResponse(res, 'Cart not found', 404);
      }
      
      const cartItem = await CartItem.findOne({
        where: { id: itemId, cart_id: cart.id }
      });
      
      if (!cartItem) {
        return errorResponse(res, 'Cart item not found', 404);
      }
      
      await cartItem.destroy();
      
      // Return updated cart
      const updatedCart = await Cart.findOne({
        where: { user_id: userId },
        include: [
          {
            model: CartItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                include: ['category', 'brand', 'media']
              }
            ]
          }
        ]
      });
      
      return successResponse(res, updatedCart, 'Item removed from cart successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clear cart
   */
  async clearCart(req, res, next) {
    try {
      const userId = req.user.id;
      
      const cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        return errorResponse(res, 'Cart not found', 404);
      }
      
      await CartItem.destroy({ where: { cart_id: cart.id } });
      
      return successResponse(res, null, 'Cart cleared successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();