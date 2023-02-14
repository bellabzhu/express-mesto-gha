const { statusCode } = require('../utils/errors');
const Card = require('../models/card');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(statusCode.OK).send(cards);
  } catch (error) {
    next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.user._id });
    res.status(statusCode.OK).send(newCard);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      res.status(statusCode.NOT_FOUND).send({ message: 'Карточка с таким таким id не найдена.' });
    }
    if (req.user._id !== card.owner.toString()) {
      res.status(statusCode.FORBIDDEN).send({ message: 'Это не ваша карточка! Удаляйте свои!' });
    }
  } catch (error) {
    next(error);
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
      res.status(statusCode.NOT_FOUND).send({ message: 'Карточка с таким таким id не найдена.' });
    }
    res.status(statusCode.OK).send(card);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      mongoPatchConfig,
    );
    return card
      ? res.status(statusCode.OK).send(card)
      : res.status(statusCode.NOT_FOUND).send({ message: 'Карточка с таким таким id не найдена.' });
  } catch (error) {
    return next(error);
  }
};
