const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message: 'Please verify your email before accessing this route'
        });
      }

      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Check module access
exports.checkModuleAccess = (module) => {
  return async (req, res, next) => {
    try {
      // Admin and product owner have access to all modules
      if (req.user.role === 'admin' || req.user.role === 'product_owner') {
        return next();
      }

      // Check if client has access to the module
      if (req.user.role === 'client') {
        if (!req.user.accessibleModules.includes(module)) {
          return res.status(403).json({
            success: false,
            message: `You do not have access to the ${module} module`
          });
        }
      }

      next();
    } catch (error) {
      console.error('Check module access error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};

// Check event access
exports.checkEventAccess = () => {
  return async (req, res, next) => {
    try {
      // Admin and product owner have access to all events
      if (req.user.role === 'admin' || req.user.role === 'product_owner') {
        return next();
      }

      // Check if client has access to the event
      if (req.user.role === 'client') {
        const eventId = req.params.id || req.body.eventId;
        
        if (!eventId) {
          return res.status(400).json({
            success: false,
            message: 'Event ID is required'
          });
        }

        if (!req.user.accessibleEvents.includes(eventId)) {
          return res.status(403).json({
            success: false,
            message: 'You do not have access to this event'
          });
        }
      }

      next();
    } catch (error) {
      console.error('Check event access error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};