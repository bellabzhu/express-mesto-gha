const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

module.exports.auth = async (req, res, next) => {
  try {
    const { authorization } = await req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res
        .status(401)
        .send({ message: 'Необходима авторизация' });
    }
    const token = authorization.replace('Bearer ', '');
    const payload = await jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
};
