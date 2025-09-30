const { Ingredient } = require('../models');
const { success } = require('../utils/apiResponse');
const { getPagination } = require('../utils/pagination');

const getIngredients = async (req, res, next) => {
  try {
    const { limit, offset, page } = getPagination(req.query);
    const { rows, count } = await Ingredient.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    return success(
      res,
      {
        ingredients: rows,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      },
      'Ingredients fetched'
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getIngredients,
};
