const mongoose = require('mongoose');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');
const { DefaultError } = require('../errors/DefaultError');

const handleErrors = (err, next) => {
  if (err instanceof NotFoundError) {
    return next(err);
  }
  if (err instanceof mongoose.Error.CastError) {
    return next(new BadRequestError('Переданы некорректные данные'));
  }
  return next(new DefaultError('Произошла ошибка'));
};

module.exports = { handleErrors };
