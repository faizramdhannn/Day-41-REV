const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending'
  },
  total_amount: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  shipping_cost: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

module.exports = Order;