const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
  let payload;
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res
        .status(401)
        .send({ message: 'Необходима авторизация' });
    }
    const token = authorization.replace('Bearer ', '');
    payload = await jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
}

module.exports = { auth };
