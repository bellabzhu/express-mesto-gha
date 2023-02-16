const mongoose = require('mongoose');
const { statusCode } = require('../utils/errors');
const Card = require('../models/card');
const Error400 = require('../errors/Error400');
const Error403 = require('../errors/Error403');
const Error404 = require('../errors/Error404');

const mongoPatchConfig = { new: true };

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(statusCode.OK).send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.user._id });
    res.status(statusCode.OK).send(newCard);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      next(new Error404('Карточка с таким таким id не найдена.'));
      return;
    }
    if (req.user._id !== card.owner.toString()) {
      next(new Error403('Это не ваша карточка! Удаляйте свои!'));
      return;
    }
    const deletedCard = await Card.findByIdAndRemove(req.params.cardId);
    res.status(statusCode.OK).send(deletedCard);
  } catch (err) {
    next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      mongoPatchConfig,
    );
    if (!card) {
      next(new Error404('Карточка с таким таким id не найдена.'));
      return;
    }
    res.status(statusCode.OK).send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      mongoPatchConfig,
    );
    if (!card) {
      next(new Error404('Карточка с таким таким id не найдена.'));
      return;
    }
    res.status(statusCode.OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new Error400('Неверный формат у id карточки.'));
    } else {
      next(err);
    }
  }
};
