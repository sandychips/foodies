const express = require('express');
const { body, param } = require('express-validator');
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', recipeController.getRecipes);
router.get('/popular', recipeController.getPopularRecipes);
router.get(
  '/:id',
  validate([param('id').isUUID()]),
  recipeController.getRecipeById
);

router.post(
  '/',
  authMiddleware,
  upload.single('thumb'),
  validate([
    body('title').isString().isLength({ min: 3 }),
    body('instructions').isString().isLength({ min: 10 }),
    body('time').isInt({ min: 1 }),
    body('categoryId').isUUID(),
    body('areaId').isUUID(),
  ]),
  recipeController.createRecipe
);

router.delete(
  '/:id',
  authMiddleware,
  validate([param('id').isUUID()]),
  recipeController.deleteRecipe
);

router.post(
  '/:id/favorite',
  authMiddleware,
  validate([param('id').isUUID()]),
  recipeController.addFavorite
);

router.delete(
  '/:id/favorite',
  authMiddleware,
  validate([param('id').isUUID()]),
  recipeController.removeFavorite
);

module.exports = router;
