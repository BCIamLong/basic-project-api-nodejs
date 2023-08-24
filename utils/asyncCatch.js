const AppError = require('./appError');
// module.exports = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    // err.message = 'Error happen';
    // err.statusCode = 404;
    next(err);
  });
  //catch(() => next(new AppError('Errors occurs', 404)));
};
