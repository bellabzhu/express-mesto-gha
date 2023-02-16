const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexURL } = require('../utils/constants');

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexURL).required(),
  }),
}), updateAvatar);

module.exports = router;
