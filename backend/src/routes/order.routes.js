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
  body('items.*.quantity').isNumeric().withMessage('Quantity must be a number').custom(value => value > 0).withMessage('Quantity must be greater than 0'),
  body('payment_method').notEmpty().withMessage('Payment method is required'),
  body('shipping_cost').optional().isNumeric().withMessage('Shipping cost must be a number'),
  validate
];

const updateStatusValidation = [
  body('status').notEmpty().withMessage('Status is required')
    .isIn(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELED'])
    .withMessage('Invalid status'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
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

const shipmentStatusValidation = [
  body('status').notEmpty().withMessage('Status is required')
    .isIn(['WAITING_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'])
    .withMessage('Invalid shipment status'),
  validate
];

const cancelOrderValidation = [
  body('reason').optional().isString().withMessage('Reason must be a string'),
  validate
];

// All routes require authentication
router.use(authenticate);

// Order CRUD
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', createOrderValidation, orderController.createOrder);

// Order status management
router.patch('/:id/status', updateStatusValidation, orderController.updateOrderStatus);
router.patch('/:id/complete', orderController.completeOrder);
router.patch('/:id/cancel', cancelOrderValidation, orderController.cancelOrder);

// Payment routes (PENDING → PAID)
router.post('/:id/payment', paymentValidation, orderController.createPayment);

// Shipment routes (PAID → SHIPPED → DELIVERED)
router.post('/:id/shipment', shipmentValidation, orderController.createShipment);
router.patch('/:id/shipment/status', shipmentStatusValidation, orderController.updateShipmentStatus);

module.exports = router;