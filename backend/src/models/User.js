const { DataTypes } = require('sequelize');
const sequelize = require('../backend/src/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  nickname: {
    type: DataTypes.STRING(100),
    allowNull: false  // Changed to NOT NULL
  },
  email: {
    type: DataTypes.STRING(150),
    unique: true,
    allowNull: false,  // Already NOT NULL
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  profile_image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false  // Changed to NOT NULL for security
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;

