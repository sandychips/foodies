const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

router.post(
  '/register',
  validate([
    body('name').isString().isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ]),
  authController.register
);

router.post(
  '/login',
  validate([
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ]),
  authController.login
);

router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.currentUser);

module.exports = router;
