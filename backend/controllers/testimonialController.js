const { Testimonial } = require('../models');
const { success } = require('../utils/apiResponse');

const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [['createdAt', 'DESC']],
    });
    return success(res, { testimonials }, 'Testimonials fetched');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getTestimonials,
};
