const { statusCode } = require('../utils/errors');

class Error403 extends Error {
  constructor(message) {
    super(message);
    this.name = 'Forbidden';
    this.statusCode = statusCode.FORBIDDEN;
  }
}

module.exports = Error403;
