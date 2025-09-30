const success = (res, data = {}, message = 'Success', status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

const error = (res, message = 'Something went wrong', status = 500, errors) => {
  const payload = { success: false, message };
  if (errors) {
    payload.errors = errors;
  }
  return res.status(status).json(payload);
};

module.exports = {
  success,
  error,
};
