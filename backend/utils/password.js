const bcrypt = require('bcryptjs');

const SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS || 10);

const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
};

const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

module.exports = {
  hashPassword,
  comparePassword,
};
