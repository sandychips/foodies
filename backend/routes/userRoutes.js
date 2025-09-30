const express = require('express');
const { param } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(authMiddleware);

router.get('/current', userController.getCurrentUser);
router.get('/followers', userController.getFollowers);
router.get('/following', userController.getFollowing);
router.get('/own', userController.getOwnRecipes);
router.get('/favorites', userController.getFavoriteRecipes);

router.patch('/avatar', upload.single('avatar'), userController.updateAvatar);
router.post(
  '/:id/follow',
  validate([param('id').isUUID()]),
  userController.followUser
);
router.delete(
  '/:id/unfollow',
  validate([param('id').isUUID()]),
  userController.unfollowUser
);
router.get(
  '/:id',
  validate([param('id').isUUID()]),
  userController.getUserById
);

module.exports = router;
