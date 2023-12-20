// you can also give this file in controller in MVC or helpers,... but it's also good

const AppError = require('../utils/appError');

const sendErrorsHandleDev = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });

  const title = `Media | ${err.statusCode} Error`;
  const heading = `${err.statusCode} Error`;
  const error = { message: err.message, statusCode: err.statusCode, heading };
  res.status(err.statusCode).render('error', { title, error });
};

const sendErrorsHandleProd = (err, req, res) => {
  // console.log(err);
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational)
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }

  const statusCode = err.statusCode ? err.statusCode : 500;
  const heading = 'Oh no, some errors occur';
  let message = err.message ? err.message : 'Something went to wrong';
  let title = `Media | ${statusCode} Error`;
  if (statusCode === 404) {
    title = 'Media | Page not found';
    message = "This page doesn't exist. Try searching for something else";
  }
  if (err.isOperational)
    return res
      .status(err.statusCode)
      .render('error', { title, error: { statusCode, message, heading } });

  res.status(err.statusCode).render('error', {
    title,
    error: { title, error: { statusCode, message } },
  });
};

const duplicateErrorHandler = err =>
  new AppError(`${Object.keys(err.keyValue)[0]} was exists `, 400);

const validationErrorHandler = err =>
  new AppError(
    `${Object.values(err.errors)
      .map(el => el.message)
      .join('. ')}`,
    400,
  );

const castErrorHandler = err =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const JWTErrorHandler = () =>
  new AppError('You dont have permisson to get this access', 401);

const JWTExpiredErrorHandler = () =>
  new AppError('Your login turn was expires, please login again', 401);

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development')
    sendErrorsHandleDev(err, req, res);
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

    sendErrorsHandleProd(errProd, req, res);
  }

  // next(); we don't need it because this middleware we alays put it as last middleware
};
