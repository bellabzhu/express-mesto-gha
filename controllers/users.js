const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

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

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch((err) => console.log(err));
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
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof (mongoose.Error.CastError) || (mongoose.Error.ValidationError)) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }
      const token = jwt.sign(
        { _id: 'd285e3dceed844f902650f40' },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return token;
    })
    .then((token) => {
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.status(OK).send(token);
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
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
