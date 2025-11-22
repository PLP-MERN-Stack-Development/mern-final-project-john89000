const { validationResult } = require('express-validator');

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

// Custom validation functions
exports.isValidObjectId = (value) => {
  return /^[0-9a-fA-F]{24}$/.test(value);
};

exports.isValidDate = (value) => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

exports.isValidEmail = (value) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(value);
};
