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
router.get('/',  cartController.getCart);
router.post('/items',  addToCartValidation, cartController.addToCart);
router.put('/items/:itemId',  updateCartValidation, cartController.updateCartItem);
router.delete('/items/:itemId',  cartController.removeFromCart);
router.delete('/clear',  cartController.clearCart);

module.exports = router;