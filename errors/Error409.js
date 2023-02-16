const { statusCode } = require('../utils/errors');

class Error409 extends Error {
  constructor(message) {
    super(message);
    this.name = 'Conflict';
    this.statusCode = statusCode.CONFLICT;
  }
}

module.exports = Error409;
