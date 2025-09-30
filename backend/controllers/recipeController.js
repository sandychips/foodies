const { Op, fn, col, literal } = require('sequelize');
const {
  Recipe,
  Category,
  Area,
  Ingredient,
  RecipeIngredient,
  User,
  UserFavoriteRecipe,
  sequelize,
} = require('../models');
const { success } = require('../utils/apiResponse');
const { getPagination } = require('../utils/pagination');
const cloudinaryUtil = require('../utils/cloudinary');

const baseIncludes = [
  { model: Category, as: 'category', attributes: ['id', 'name'] },
  { model: Area, as: 'area', attributes: ['id', 'name'] },
  { model: User, as: 'owner', attributes: ['id', 'name', 'avatar'] },
];

const getIngredientsInclude = (ingredientId) => {
  const include = {
    model: Ingredient,
    as: 'ingredients',
    attributes: ['id', 'name'],
    through: { attributes: ['measure'] },
  };

  if (ingredientId) {
    include.where = { id: ingredientId };
  }

  return include;
};

const buildRecipeWhere = (query) => {
  const where = {};
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }
  if (query.areaId) {
    where.areaId = query.areaId;
  }
  if (query.ownerId) {
    where.ownerId = query.ownerId;
  }
  if (query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${query.search}%` } },
      { description: { [Op.iLike]: `%${query.search}%` } },
    ];
  }
  return where;
};

const getRecipes = async (req, res, next) => {
  try {
    const { limit, offset, page } = getPagination(req.query);
    const where = buildRecipeWhere(req.query);
    const ingredientId = req.query.ingredientId;

    const includes = [...baseIncludes, getIngredientsInclude(ingredientId)];

    const { rows, count } = await Recipe.findAndCountAll({
      where,
      include: includes,
      limit,
      offset,
      distinct: true,
      order: [['createdAt', 'DESC']],
    });

    return success(
      res,
      {
        recipes: rows,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      },
      'Recipes fetched'
    );
  } catch (err) {
    return next(err);
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id, {
      include: [...baseIncludes, getIngredientsInclude()],
    });
    if (!recipe) {
      const error = new Error('Recipe not found');
      error.status = 404;
      throw error;
    }
    return success(res, { recipe }, 'Recipe fetched');
  } catch (err) {
    return next(err);
  }
};

const getPopularRecipes = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const recipes = await Recipe.findAll({
      attributes: {
        include: [[fn('COUNT', col('likedBy.id')), 'favoritesCount']],
      },
      include: [
        ...baseIncludes,
        {
          model: User,
          as: 'likedBy',
          attributes: [],
          through: { attributes: [] },
        },
      ],
      group: ['Recipe.id', 'category.id', 'area.id', 'owner.id'],
      order: [[literal('"favoritesCount"'), 'DESC']],
      limit,
    });

    return success(res, { recipes }, 'Popular recipes fetched');
  } catch (err) {
    return next(err);
  }
};

const normalizeIngredients = (raw) => {
  if (!raw) return [];
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch (error) {
      return [];
    }
  }
  return Array.isArray(raw) ? raw : [];
};

const createRecipe = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      title,
      description,
      instructions,
      time,
      categoryId,
      areaId,
    } = req.body;

    const ingredients = normalizeIngredients(req.body.ingredients);

    let thumb;
    if (req.file) {
      if (cloudinaryUtil.isConfigured) {
        const uploaded = await cloudinaryUtil.uploadBuffer(req.file.buffer, {
          folder: 'foodies/recipes',
          resource_type: 'image',
        });
        thumb = uploaded.secure_url;
      } else {
        thumb = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      }
    }

    const recipe = await Recipe.create(
      {
        title,
        description,
        instructions,
        time,
        categoryId,
        areaId,
        thumb,
        ownerId: req.user.id,
      },
      { transaction: t }
    );

    if (ingredients.length > 0) {
      const payload = ingredients.map((item) => ({
        recipeId: recipe.id,
        ingredientId: item.ingredientId,
        measure: item.measure,
      }));
      await RecipeIngredient.bulkCreate(payload, { transaction: t });
    }

    await t.commit();

    const recipeWithRelations = await Recipe.findByPk(recipe.id, {
      include: [...baseIncludes, getIngredientsInclude()],
    });

    return success(res, { recipe: recipeWithRelations }, 'Recipe created', 201);
  } catch (err) {
    await t.rollback();
    return next(err);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      const error = new Error('Recipe not found');
      error.status = 404;
      throw error;
    }

    if (recipe.ownerId !== req.user.id) {
      const error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }

    await Recipe.destroy({ where: { id } });
    return success(res, {}, 'Recipe deleted');
  } catch (err) {
    return next(err);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      const error = new Error('Recipe not found');
      error.status = 404;
      throw error;
    }

    await UserFavoriteRecipe.findOrCreate({
      where: { userId: req.user.id, recipeId: id },
      defaults: { userId: req.user.id, recipeId: id },
    });

    return success(res, {}, 'Recipe added to favorites', 201);
  } catch (err) {
    return next(err);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    await UserFavoriteRecipe.destroy({ where: { userId: req.user.id, recipeId: id } });
    return success(res, {}, 'Recipe removed from favorites');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  getPopularRecipes,
  createRecipe,
  deleteRecipe,
  addFavorite,
  removeFavorite,
};
