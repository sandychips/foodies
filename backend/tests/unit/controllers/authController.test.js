const {
  register,
  login,
  logout,
  currentUser,
} = require('../../../controllers/authController');
const { User } = require('../../../models');
const { hashPassword, comparePassword } = require('../../../utils/password');
const { signAccessToken, signRefreshToken } = require('../../../utils/jwt');
const { getUserProfileWithStats } = require('../../../services/userService');
const httpMocks = require('node-mocks-http');

jest.mock('../../../models');
jest.mock('../../../utils/password');
jest.mock('../../../utils/jwt');
jest.mock('../../../services/userService');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should register a new user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      };

      const mockUserProfile = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar: null,
        stats: {
          recipesCount: 0,
          favoritesCount: 0,
          followersCount: 0,
          followingCount: 0,
        },
      };

      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue(null);
      hashPassword.mockResolvedValue('hashed-password');
      User.create.mockResolvedValue(mockUser);
      signAccessToken.mockReturnValue('access-token');
      signRefreshToken.mockReturnValue('refresh-token');
      getUserProfileWithStats.mockResolvedValue(mockUserProfile);

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(hashPassword).toHaveBeenCalledWith('password123');
      expect(User.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
      });
      expect(signAccessToken).toHaveBeenCalledWith({
        id: 1,
        email: 'test@example.com',
      });
      expect(signRefreshToken).toHaveBeenCalledWith({
        id: 1,
        email: 'test@example.com',
      });

      expect(res.statusCode).toBe(201);
      const data = res._getJSONData();
      expect(data.success).toBe(true);
      expect(data.message).toBe('User registered');
      expect(data.data.user).toEqual(mockUserProfile);
      expect(data.data.token).toBe('access-token');
      expect(data.data.refreshToken).toBe('refresh-token');
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 409 if email already exists', async () => {
      req.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue({ id: 1, email: 'existing@example.com' });

      await register(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Email already in use');
      expect(error.status).toBe(409);
    });

    test('should handle database errors', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      User.findOne.mockRejectedValue(new Error('Database connection failed'));

      await register(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].message).toBe('Database connection failed');
    });
  });

  describe('login', () => {
    test('should login user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
      };

      const mockUserProfile = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar: null,
        stats: {
          recipesCount: 5,
          favoritesCount: 10,
          followersCount: 2,
          followingCount: 3,
        },
      };

      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(true);
      signAccessToken.mockReturnValue('access-token');
      signRefreshToken.mockReturnValue('refresh-token');
      getUserProfileWithStats.mockResolvedValue(mockUserProfile);

      await login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(comparePassword).toHaveBeenCalledWith('password123', 'hashed-password');

      expect(res.statusCode).toBe(200);
      const data = res._getJSONData();
      expect(data.success).toBe(true);
      expect(data.message).toBe('Login successful');
      expect(data.data.user).toEqual(mockUserProfile);
      expect(data.data.token).toBe('access-token');
      expect(data.data.refreshToken).toBe('refresh-token');
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 if user not found', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue(null);

      await login(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Invalid credentials');
      expect(error.status).toBe(401);
    });

    test('should return 401 if password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
      };

      req.body = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      User.findOne.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(false);

      await login(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Invalid credentials');
      expect(error.status).toBe(401);
    });
  });

  describe('logout', () => {
    test('should logout user successfully', async () => {
      await logout(req, res, next);

      expect(res.statusCode).toBe(200);
      const data = res._getJSONData();
      expect(data.success).toBe(true);
      expect(data.message).toBe('Logged out');
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('currentUser', () => {
    test('should return current user profile', async () => {
      const mockUserProfile = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'https://example.com/avatar.jpg',
        stats: {
          recipesCount: 5,
          favoritesCount: 10,
          followersCount: 2,
          followingCount: 3,
        },
      };

      req.user = { id: 1, email: 'test@example.com' };
      getUserProfileWithStats.mockResolvedValue(mockUserProfile);

      await currentUser(req, res, next);

      expect(getUserProfileWithStats).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(200);
      const data = res._getJSONData();
      expect(data.success).toBe(true);
      expect(data.message).toBe('User fetched');
      expect(data.data.user).toEqual(mockUserProfile);
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 404 if user not found', async () => {
      req.user = { id: 999, email: 'test@example.com' };
      getUserProfileWithStats.mockResolvedValue(null);

      await currentUser(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error.message).toBe('User not found');
      expect(error.status).toBe(404);
    });
  });
});