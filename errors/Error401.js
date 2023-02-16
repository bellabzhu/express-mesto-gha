const { statusCode } = require('../utils/errors');

class Error401 extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unauthorized';
    this.statusCode = statusCode.UNAUTHORIZED;
  }
}

module.exports = Error401;
