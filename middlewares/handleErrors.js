const { statusCode } = require('../utils/errors');

module.exports.handleErrors = (err, req, res, next) => {
  const { status = statusCode.INTERNAL_SERVER, message } = err;
  res.status(status).send({
    message: status === statusCode.INTERNAL_SERVER
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};
