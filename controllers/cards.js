const mongoose = require('mongoose');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER,
  FORBIDDEN,
} = require('../utils/errors');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(() => res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err instanceof (mongoose.Error.CastError) || (mongoose.Error.ValidationError)) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с таким таким id не найдена.' });
      }
      if (req.user._id !== card.owner.toString()) {
        return res.status(FORBIDDEN).send({ message: 'Это не ваша карточка! Удаляйте свои!' });
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err instanceof (mongoose.Error.CastError) || (mongoose.Error.ValidationError)) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

const mongoPatchConfig = { new: true, runValidators: true };

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    mongoPatchConfig,
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с таким таким id не найдена.' });
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err instanceof (mongoose.Error.CastError) || (mongoose.Error.ValidationError)) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    mongoPatchConfig,
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с таким таким id не найдена.' });
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err instanceof (mongoose.Error.CastError) || (mongoose.Error.ValidationError)) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с таким таким id не найдена.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};
