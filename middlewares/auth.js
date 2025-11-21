const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { errorResponse } = require('../utils/response');
const { User } = require('../models');

/**
 * Middleware untuk autentikasi JWT
 */
const authenticate = async (req, res, next) => {
  try {
    // Ambil token dari header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Cari user
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }
    
    // Attach user ke request
    req.user = {
      id: user.id,
      email: user.email,
      full_name: user.full_name
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', 401);
    }
    return errorResponse(res, 'Authentication failed', 401);
  }
};

/**
 * Middleware optional auth - tidak error jika tidak ada token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findByPk(decoded.userId);
      
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          full_name: user.full_name
        };
      }
    }
    
    next();
  } catch (error) {
    // Ignore errors untuk optional auth
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};