const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { Error401 } = require('../errors/Error401');

const auth = async (req, res, next) => {
  const { token } = req.cookies;
  let payload;
  try {
    payload = await jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new Error401('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = { auth };
