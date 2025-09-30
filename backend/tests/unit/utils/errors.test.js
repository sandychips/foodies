const {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
} = require('../../../utils/errors');

describe('Error Classes', () => {
  describe('AppError', () => {
    test('should create error with default status 500', () => {
      const error = new AppError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.status).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe('AppError');
    });

    test('should create error with custom status code', () => {
      const error = new AppError('Custom error', 418);

      expect(error.statusCode).toBe(418);
      expect(error.status).toBe(418);
    });

    test('should include additional errors', () => {
      const validationErrors = [{ field: 'email', message: 'Invalid email' }];
      const error = new AppError('Validation failed', 400, validationErrors);

      expect(error.errors).toEqual(validationErrors);
    });
  });

  describe('BadRequestError', () => {
    test('should create 400 error', () => {
      const error = new BadRequestError('Bad request');

      expect(error.message).toBe('Bad request');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });

    test('should use default message', () => {
      const error = new BadRequestError();

      expect(error.message).toBe('Bad Request');
    });
  });

  describe('UnauthorizedError', () => {
    test('should create 401 error', () => {
      const error = new UnauthorizedError('Not authorized');

      expect(error.message).toBe('Not authorized');
      expect(error.statusCode).toBe(401);
    });

    test('should use default message', () => {
      const error = new UnauthorizedError();

      expect(error.message).toBe('Unauthorized');
    });
  });

  describe('ForbiddenError', () => {
    test('should create 403 error', () => {
      const error = new ForbiddenError('Access denied');

      expect(error.message).toBe('Access denied');
      expect(error.statusCode).toBe(403);
    });
  });

  describe('NotFoundError', () => {
    test('should create 404 error', () => {
      const error = new NotFoundError('User not found');

      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
    });

    test('should use default message', () => {
      const error = new NotFoundError();

      expect(error.message).toBe('Resource not found');
    });
  });

  describe('ConflictError', () => {
    test('should create 409 error', () => {
      const error = new ConflictError('Email already exists');

      expect(error.message).toBe('Email already exists');
      expect(error.statusCode).toBe(409);
    });
  });

  describe('ValidationError', () => {
    test('should create 422 error with validation details', () => {
      const validationErrors = [
        { field: 'email', message: 'Invalid email format' },
        { field: 'password', message: 'Password too short' },
      ];
      const error = new ValidationError('Validation failed', validationErrors);

      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(422);
      expect(error.errors).toEqual(validationErrors);
    });
  });

  describe('InternalServerError', () => {
    test('should create 500 error', () => {
      const error = new InternalServerError('Database connection failed');

      expect(error.message).toBe('Database connection failed');
      expect(error.statusCode).toBe(500);
    });

    test('should use default message', () => {
      const error = new InternalServerError();

      expect(error.message).toBe('Internal Server Error');
    });
  });

  describe('Error inheritance', () => {
    test('all error classes should extend AppError', () => {
      expect(new BadRequestError()).toBeInstanceOf(AppError);
      expect(new UnauthorizedError()).toBeInstanceOf(AppError);
      expect(new ForbiddenError()).toBeInstanceOf(AppError);
      expect(new NotFoundError()).toBeInstanceOf(AppError);
      expect(new ConflictError()).toBeInstanceOf(AppError);
      expect(new ValidationError()).toBeInstanceOf(AppError);
      expect(new InternalServerError()).toBeInstanceOf(AppError);
    });

    test('all error classes should extend Error', () => {
      expect(new AppError('test')).toBeInstanceOf(Error);
      expect(new BadRequestError()).toBeInstanceOf(Error);
    });
  });
});