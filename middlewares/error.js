// you can also give this file in controller in MVC or helpers,... but it's also good

const AppError = require('../utils/appError');

const sendErrorsHandleDev = (err, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorsHandleProd = (err, res) => {
  if (err.isOperational)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

const duplicateErrorHandler = (err) => {
  return new AppError(`${Object.keys(err.keyValue)[0]} was exists `, 400);
};
const validationErrorHandler = (err) => {
  return new AppError(
    `${Object.values(err.errors)
      .map((el) => el.message)
      .join('. ')}`,
    400
  );
};
const castErrorHandler = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const JWTErrorHandler = () =>
  new AppError('You dont have permisson to get this access', 401);

const JWTExpiredErrorHandler = () =>
  new AppError('Your login turn was expires, please login again', 401);

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') sendErrorsHandleDev(err, res);
  if (process.env.NODE_ENV === 'production') {
    let errProd = { ...err };

    if (errProd.code && errProd.code === 11000)
      errProd = duplicateErrorHandler(errProd);
    if (errProd._message && errProd._message === 'Validation failed')
      errProd = validationErrorHandler(errProd);
    if (errProd.reason?.name === 'BSONError')
      errProd = castErrorHandler(errProd);
    if (errProd.name === 'JsonWebTokenError') errProd = JWTErrorHandler();
    if (errProd.name === 'TokenExpiredError')
      errProd = JWTExpiredErrorHandler();

    sendErrorsHandleProd(errProd, res);
  }

  // next(); we don't need it because this middleware we alays put it as last middleware
};
