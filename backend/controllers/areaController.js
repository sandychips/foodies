const { Area } = require('../models');
const { success } = require('../utils/apiResponse');

const getAreas = async (req, res, next) => {
  try {
    const areas = await Area.findAll({ order: [['name', 'ASC']] });
    return success(res, { areas }, 'Areas fetched');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAreas,
};
