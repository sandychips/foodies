const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');
const { success } = require('../utils/apiResponse');
const { getUserProfileWithStats } = require('../services/userService');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new ConflictError('Email already in use');
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed });
    const payload = { id: user.id, email: user.email };
    const token = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const userData = await getUserProfileWithStats(user.id);

    return success(res, { user: userData, token, refreshToken }, 'User registered', 201);
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email };
    const token = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const userData = await getUserProfileWithStats(user.id);

    return success(res, { user: userData, token, refreshToken }, 'Login successful');
  } catch (err) {
    return next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    return success(res, {}, 'Logged out');
  } catch (err) {
    return next(err);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const userData = await getUserProfileWithStats(req.user.id);
    if (!userData) {
      throw new NotFoundError('User not found');
    }
    return success(res, { user: userData }, 'User fetched');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  currentUser,
};
