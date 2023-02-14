const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoUpdateConfig = { new: true, runValidators: true };
const { NODE_ENV, JWT_SECRET } = process.env;

const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER,
  NOT_UNIQUE,
} = require('../utils/errors');
const User = require('../models/user');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(OK).send(users);
  } catch (error) {
    next(error);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(NOT_FOUND).send({ message: 'Пользователь c таким id не найден.' });
    }
    res.status(OK).send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
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
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } if (err.code === 11000) {
        next(new NOT_UNIQUE({ message: 'Пользователь с таким email уже зарегистрирован.' }));
      }
      res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new Error('Неправильная почта или пароль'));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      next(new Error('Неправильная почта или пароль'));
    }
    const token = await jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    });
    res.status(OK).send(token);
  } catch (error) {
    next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      mongoUpdateConfig,
    );
    res.status(OK).send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      mongoUpdateConfig,
    );
    res.status(OK).send(user);
  } catch (error) {
    next(error);
  }
};
