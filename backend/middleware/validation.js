const { validationResult } = require('express-validator');
const { error } = require('../utils/apiResponse');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    return error(res, 'Validation failed', 400, result.array());
  };
};

module.exports = validate;
