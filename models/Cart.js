const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'carts',
  timestamps: true,
  updatedAt: false
});

module.exports = Cart;