const { Category } = require('../models');
const { success } = require('../utils/apiResponse');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return success(res, { categories }, 'Categories fetched');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCategories,
};
