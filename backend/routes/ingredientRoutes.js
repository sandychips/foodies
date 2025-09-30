const express = require('express');
const ingredientController = require('../controllers/ingredientController');

const router = express.Router();

router.get('/', ingredientController.getIngredients);

module.exports = router;
