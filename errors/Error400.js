const { statusCode } = require('../utils/errors');

class Error400 extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequest';
    this.statusCode = statusCode.BAD_REQUEST;
  }
}

module.exports = { Error400 };
