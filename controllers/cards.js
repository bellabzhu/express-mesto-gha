const { handleErrors } = require('../middlewares/handleErrors');

const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => { handleErrors(err, next); });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => { handleErrors(err, next); });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => { handleErrors(err, next); });
};

const mongoPatchConfig = { new: true, runValidators: true, upsert: true };

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    mongoPatchConfig,
  )
    .then((card) => res.send(card))
    .catch((err) => { handleErrors(err, next); });
};

module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    mongoPatchConfig,
  )
    .then((card) => res.send(card))
    .catch((err) => { handleErrors(err, next); });
};
