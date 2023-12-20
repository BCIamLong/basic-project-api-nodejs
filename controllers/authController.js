const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const asyncCatch = require('../utils/asyncCatch');
const Email = require('../utils/email');

const cookieOptions = {
  httpOnly: true,
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  ),
};

if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

const signToken = user =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPiRES_IN,
  });

const sendJWT = (res, statusCode, user) => {
  const token = signToken(user);
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
  });
};
const signup = asyncCatch(async (req, res, next) => {
  const {
    name,
    username,
    password,
    passwordConfirm,
    email,
    phone,
    passwordChangedAt,
  } = req.body;
  // console.log(req.body);
  if (!username || !password || !passwordConfirm || !email || !name)
    return next(new AppError('Please fill all the required fieald', 400));

  const newUser = await User.create({
    name,
    username,
    password,
    passwordConfirm,
    email,
    phone,
    passwordChangedAt,
  });
  sendJWT(res, 200, newUser);
});

const login = asyncCatch(async (req, res, next) => {
  const { username, password, email, phone } = req.body;

  if (
    (!username && !password) ||
    (!email && !password) ||
    (!phone && !password)
  )
    return next(new AppError('Please fill all the required fieald', 400));

  const user =
    (await User.findOne({ username }).select('+password')) ||
    (await User.findOne({ email }).select('+password')) ||
    (await User.findOne({ phone }).select('+password'));
  if (!user)
    return next(
      new AppError(
        'This field not correct, please fill your email or username or phone ',
        400,
      ),
    );
  const correct = await user?.checkPassword(password, user.password);
  if (!correct)
    return next(
      new AppError('Password not correct, please check and try again ', 400),
    );
  sendJWT(res, 200, user);
});

const isLoggedIn = asyncCatch(async (req, res, next) => {
  // console.log(req.headers);
  const token = req.cookies.jwt;
  if (!token) return next();
  // if (!token) return res.redirect('/login');

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next();

  if (currentUser.checkPasswordChangeAfter(decoded.iat)) return next();

  res.locals.user = currentUser;
  // req.user = currentUser;
  next();
});

const isLoggedIn2 = (req, res, next) => {
  // console.log(res.locals.user);
  if (!res.user) return res.redirect('login');
  next();
};

const protect = asyncCatch(async (req, res, next) => {
  // console.log(req.headers);
  // if (!req.headers.authorization?.startsWith('Bearer'))
  //   return next(
  //     new AppError('You dont loggin, please login to get access ', 401),
  //   );
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.jwt;
  if (!token)
    return next(
      new AppError('You dont loggin, please login to get access ', 401),
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError(
        'This account has been deleted, please contact with us to know detail',
        401,
      ),
    );

  if (currentUser.checkPasswordChangeAfter(decoded.iat))
    return next(
      new AppError(
        'This user recently changed password, please login again',
        401,
      ),
    );

  req.user = currentUser;
  next();
});

//* logout: we will delete bearer token and cookie in the real time we only delete cookie because we use token from cookie, bearer token only for development
const logout = asyncCatch(async (req, res, next) => {
  delete req.headers.authorization;
  res.clearCookie('jwt').status(204).json({
    status: 'success',
    message: 'Logout success',
    token: '',
  });
});

/**
 * Allow user has allow role to perform this action like admin, manager,...
 *
 * Conditions: user must has the allow role
 *
 * @param  {Array} roles - The roles array constain all allow roles
 * @returns {Function} middlewareFunction - The middleware function (req, res, next) is standard of express to execute in middleware stack
 */
const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role))
      return next(
        new AppError('You dont have permission to perform this', 403),
      );

    next();
  };

/**
 * Allow user forgot password can reset password with email user
 *
 * Conditions: user email must to correct
 *
 * User only pass email and click send, app will auto send mail to user email , and user click to this link in this mail to get access to reset password page
 * @param {Function} asyncCatch - The async funtion like try catch block
 * @returns {Function} middlewareFunction - The middleware function
 */
const forgotPassword = asyncCatch(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Please fill your email', 400));
  const user = await User.findOne({ email });
  if (!user) return next(new AppError('Your email is not correct', 401));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const url = `${req.protocol}://${req.hostname}:3000/api/v1/users/reset-password/${resetToken}`;
  try {
    const emailPwd = new Email(user, url);
    emailPwd.sendForgotPassword();

    res.status(200).json({
      status: 'success',
      message: 'Sent mail to your email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenTimeout = undefined;
    await user.save();
  }
});

/**
 * Allow user can reset password when user forgot password
 *
 * User click link in user email and go to reset password page and reset password
 *
 * User enter new password and confirm must to correct
 *
 * @param {Function} asyncCatch - The async funtion like try catch block
 * @returns {Function} middlewareFunction - The middleware function
 */
const resetPassword = asyncCatch(async (req, res, next) => {
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken,
    passwordResetTokenTimeout: { $gt: Date.now() },
  });
  if (!user)
    return next(
      new AppError('Your reset password token invalid or expired', 401),
    );

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenTimeout = undefined;

  await user.save();

  sendJWT(res, 201, user);
});

/**
 * Allow user can update the current user password
 *
 * Condition: user must to login, re-enter password, enter new password and confirm
 *
 * @param {Function} asyncCatch - The async funtion like try catch block
 * @returns {Function} middlewareFunction - The middleware function
 */
const updatePassword = asyncCatch(async (req, res, next) => {
  const { currentPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!currentPassword)
    return next(new AppError('Please re-enter password to confirm', 400));
  const check = await user.checkPassword(currentPassword, user.password);
  if (!check) return next(new AppError('Your password is not correct', 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
  sendJWT(res, 201, user);
});

module.exports = {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  restrictTo,
  updatePassword,
  logout,
  isLoggedIn,
  isLoggedIn2,
};
