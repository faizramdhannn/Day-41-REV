const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, optionalAuth } = require('../middlewares/auth');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Validation rules
const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('stock').isNumeric().withMessage('Stock must be a number'),
  validate
];

// Public routes (no auth required)
router.get('/', optionalAuth, productController.getAllProducts);
router.get('/categories', productController.getAllCategories);
router.get('/brands', productController.getAllBrands);
router.get('/:id', optionalAuth, productController.getProductById);

// Protected routes (auth required)
router.post('/', authenticate, productValidation, productController.createProduct);
router.put('/:id', authenticate, productValidation, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

module.exports = router;