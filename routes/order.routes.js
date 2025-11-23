const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// Validation rules
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Items must be an array with at least one item'),
  body('items.*.product_id').isNumeric().withMessage('Product ID must be a number'),
  body('items.*.quantity').isNumeric().withMessage('Quantity must be a number'),
  body('payment_method').notEmpty().withMessage('Payment method is required'),
  validate
];

const paymentValidation = [
  body('provider').notEmpty().withMessage('Provider is required'),
  body('transaction_id').notEmpty().withMessage('Transaction ID is required'),
  validate
];

const shipmentValidation = [
  body('courier').notEmpty().withMessage('Courier is required'),
  body('tracking_number').notEmpty().withMessage('Tracking number is required'),
  validate
];

// ROUTES — semua yang butuh user, harus authenticate
router.get('/', authenticate, orderController.getAllOrders);
router.get('/:id', authenticate, orderController.getOrderById);

// CREATE ORDER — wajib login
router.post('/', authenticate, createOrderValidation, orderController.createOrder);

// UPDATE STATUS — admin/user login
router.patch('/:id/status', authenticate, orderController.updateOrderStatus);

// Payment routes
router.post('/:id/payment', authenticate, paymentValidation, orderController.createPayment);

// Shipment routes
router.post('/:id/shipment', authenticate, shipmentValidation, orderController.createShipment);
router.patch('/:id/shipment/status', authenticate, orderController.updateShipmentStatus);

module.exports = router;
