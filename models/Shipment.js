const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courier: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tracking_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  shipped_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'shipments',
  timestamps: false
});

module.exports = Shipment;