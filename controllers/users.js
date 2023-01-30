const User = require('../models/user');
const { handleErrors } = require('../middlewares/handleErrors');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => { handleErrors(err, next); });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => res.send(user))
    .catch((err) => { handleErrors(err, next); });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => { handleErrors(err, next); });
};

const mongoPatchConfig = { new: true, runValidators: true, upsert: true };

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    mongoPatchConfig,
  )
    .then((user) => res.send(user))
    .catch((err) => { handleErrors(err, next); });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    mongoPatchConfig,
  )
    .then((user) => res.send(user))
    .catch((err) => { handleErrors(err, next); });
};
