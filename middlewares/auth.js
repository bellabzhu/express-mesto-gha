const jwt = require('jsonwebtoken');
const Error401 = require('../errors/Error401');

const auth = async (req, res, next) => {
  const { token } = req.cookies;
  let payload;
  try {
    payload = jwt.verify(token, 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    next(new Error401('Необходима авторизация.'));
  }
};

module.exports = { auth };
