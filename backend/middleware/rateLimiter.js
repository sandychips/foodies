const rateLimit = require('express-rate-limit');

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const max = Number(process.env.RATE_LIMIT_MAX || 100);

const limiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = (req, res, next) => {
  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    return next();
  }
  return limiter(req, res, next);
};
