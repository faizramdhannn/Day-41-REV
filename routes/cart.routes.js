const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middlewares/auth');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Validation rules
const addToCartValidation = [
  body('product_id').isNumeric().withMessage('Product ID must be a number'),
  body('quantity').optional().isNumeric().withMessage('Quantity must be a number'),
  validate
];

const updateCartValidation = [
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  validate
];

// Routes
router.get('/', authenticate, cartController.getCart);
router.post('/items', authenticate, addToCartValidation, cartController.addToCart);
router.put('/items/:itemId', authenticate, updateCartValidation, cartController.updateCartItem);
router.delete('/items/:itemId', authenticate, cartController.removeFromCart);
router.delete('/clear', authenticate, cartController.clearCart);

module.exports = router;