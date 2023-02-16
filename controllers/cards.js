const { statusCode } = require('../utils/errors');
const Card = require('../models/card');
const { Error403 } = require('../errors/Error403');
const { Error404 } = require('../errors/Error404');

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
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      next(new Error404('Карточка с таким таким id не найдена.'));
    }
    if (req.user._id !== card.owner.toString()) {
      next(new Error403('Это не ваша карточка! Удаляйте свои!'));
    }
  } catch (err) {
    next(err);
  }
};

const mongoPatchConfig = { new: true, runValidators: true };

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      mongoPatchConfig,
    );
    if (!card) {
      next(new Error404('Карточка с таким таким id не найдена.'));
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
    }
    res.status(statusCode.OK).send(card);
  } catch (err) {
    next(err);
  }
};
