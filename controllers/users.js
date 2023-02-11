const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    .catch(() => res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь c таким id не найден.' });
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err instanceof (mongoose.Error.CastError) || (mongoose.Error.ValidationError)) {
        return res.status(BAD_REQUEST).send({ message: 'Переданые некорректные данные. Неверный формат у id пользователя' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  const cryptedPass = bcrypt.hash(password, 10);
  User.create({
    name,
    about,
    avatar,
    email,
    cryptedPass,
  })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof (mongoose.Error.CastError) || (mongoose.Error.ValidationError)) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

const mongoUpdateConfig = { new: true, runValidators: true };

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    mongoUpdateConfig,
  )
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof (mongoose.Error.CastError) || (mongoose.Error.ValidationError)) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь c таким id не найден.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
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
      if (err instanceof (mongoose.Error.CastError) || (mongoose.Error.ValidationError)) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь c таким id не найден.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};
