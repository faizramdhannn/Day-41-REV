const sequelize = require('../db');

// Import semua model
const User = require('./User');
const UserAddress = require('./UserAddress');
const Product = require('./Product');
const Category = require('./Category');
const Brand = require('./Brand');
const ProductMedia = require('./ProductMedia');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const Shipment = require('./Shipment');

// ========== RELASI ==========

// User 1 --- n UserAddress
User.hasMany(UserAddress, { foreignKey: 'user_id', as: 'addresses' });
UserAddress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User 1 --- n Order
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User 1 --- n Cart
User.hasMany(Cart, { foreignKey: 'user_id', as: 'carts' });
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product n --- 1 Category
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Product n --- 1 Brand
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });

// Product 1 --- n ProductMedia
Product.hasMany(ProductMedia, { foreignKey: 'product_id', as: 'media' });
ProductMedia.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Cart 1 --- n CartItem
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });

// Product 1 --- n CartItem
Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order 1 --- n OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product 1 --- n OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order 1 --- 1 Payment
Order.hasOne(Payment, { foreignKey: 'order_id', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Order 1 --- 1 Shipment
Order.hasOne(Shipment, { foreignKey: 'order_id', as: 'shipment' });
Shipment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Export semua model
module.exports = {
  sequelize,
  User,
  UserAddress,
  Product,
  Category,
  Brand,
  ProductMedia,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Shipment
};