const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const recipeRoutes = require('./recipeRoutes');
const categoryRoutes = require('./categoryRoutes');
const areaRoutes = require('./areaRoutes');
const ingredientRoutes = require('./ingredientRoutes');
const testimonialRoutes = require('./testimonialRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/recipes', recipeRoutes);
router.use('/categories', categoryRoutes);
router.use('/areas', areaRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/testimonials', testimonialRoutes);

module.exports = router;
