const logger = require('../utils/logger');
const { error } = require('../utils/apiResponse');
const { AppError } = require('../utils/errors');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error('Error occurred', {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    statusCode: err.statusCode || err.status,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Handle operational errors (AppError instances)
  if (err instanceof AppError || err.isOperational) {
    return error(res, err.message, err.statusCode || err.status || 500, err.errors);
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const validationErrors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return error(res, 'Validation failed', 422, validationErrors);
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return error(res, 'Resource already exists', 409);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return error(res, 'Token expired', 401);
  }

  // Handle multer file upload errors
  if (err.name === 'MulterError') {
    return error(res, `File upload error: ${err.message}`, 400);
  }

  // Handle unexpected errors
  logger.error('Unexpected error', {
    error: err,
    stack: err.stack,
  });

  return error(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    500
  );
};

module.exports = errorHandler;
