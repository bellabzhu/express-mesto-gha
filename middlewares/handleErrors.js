const { errorCode } = require('../utils/errors');

module.exports.handleError = (err, req, res, next) => {
  const { status = errorCode.INTERNAL_SERVER, message } = err;
  res.status(status).send({
    message: status === errorCode.INTERNAL_SERVER
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};
