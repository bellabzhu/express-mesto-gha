const mongoose = require('mongoose');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER,
} = require('../utils/errors');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res.status(INTERNAL_SERVER).send({ message: 'Ошибка сервера' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: `Переданые некорректные данные. Неверный формат у id: ${req.params.id}` });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: `Пользователь с id ${req.params.id} не найден.` });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
    });
};

const mongoUpdateConfig = { new: true, runValidators: true, upsert: true };

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    mongoUpdateConfig,
  )
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: `Пользователь с id ${req.params.id} не найден.` });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    mongoUpdateConfig,
  )
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: `Пользователь с id ${req.params.id} не найден.` });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
    });
};
