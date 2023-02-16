const { statusCode } = require('../utils/errors');

class Error404 extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
    this.statusCode = statusCode.NOT_FOUND;
  }
}

module.exports = Error404;
