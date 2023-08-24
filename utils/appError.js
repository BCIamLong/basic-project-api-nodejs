class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode < 500 ? 'fails' : 'error';

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // keep stack trace don't effect by constructor from this class because maybe it'll popullte the stack trace
  }
}
module.exports = AppError;
