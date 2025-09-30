const authMiddleware = require('../../../middleware/auth');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('Authorization header validation', () => {
    test('should return 401 if authorization header is missing', () => {
      authMiddleware(req, res, next);

      expect(res.statusCode).toBe(401);
      const data = res._getJSONData();
      expect(data.success).toBe(false);
      expect(data.message).toBe('Authorization header missing');
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 if token is missing from header', () => {
      req.headers.authorization = 'Bearer ';

      authMiddleware(req, res, next);

      expect(res.statusCode).toBe(401);
      const data = res._getJSONData();
      expect(data.success).toBe(false);
      expect(data.message).toBe('Token missing');
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 if authorization header format is invalid', () => {
      req.headers.authorization = 'InvalidFormat';

      authMiddleware(req, res, next);

      expect(res.statusCode).toBe(401);
      const data = res._getJSONData();
      expect(data.success).toBe(false);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Token verification', () => {
    test('should return 401 if token is invalid', () => {
      req.headers.authorization = 'Bearer invalid-token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authMiddleware(req, res, next);

      expect(res.statusCode).toBe(401);
      const data = res._getJSONData();
      expect(data.success).toBe(false);
      expect(data.message).toBe('Invalid or expired token');
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 if token is expired', () => {
      req.headers.authorization = 'Bearer expired-token';
      jwt.verify.mockImplementation(() => {
        const error = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      authMiddleware(req, res, next);

      expect(res.statusCode).toBe(401);
      const data = res._getJSONData();
      expect(data.success).toBe(false);
      expect(data.message).toBe('Invalid or expired token');
      expect(next).not.toHaveBeenCalled();
    });

    test('should call next() and set req.user if token is valid', () => {
      const mockDecoded = { id: 1, email: 'test@example.com' };
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue(mockDecoded);

      authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
      expect(req.user).toEqual(mockDecoded);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
      expect(res.statusCode).toBe(200);
    });
  });
});