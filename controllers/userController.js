const User = require('../models/userModel');
const APIFeature = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const asyncCatch = require('../utils/asyncCatch');

const getAllUsers = asyncCatch(async (req, res) => {
  const count = await User.countDocuments({});
  const apiFeatures = new APIFeature(User.find(), req.query)
    .sort()
    .select()
    .pagination(count);
  const users = await apiFeatures.query;
  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      users,
    },
  });
});
const getUser = asyncCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // console.log(`Companny info: ${user.compannyInfo}`);
  if (!user) return next(new AppError('This user is not exits', 400));
  res.status(200).json({
    status: 'Success',
    data: {
      user,
    },
  });
});
const createUser = asyncCatch(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      user,
    },
  });
});
const checkReqBodyStringType = (req, res, next) => {
  if (req.body.userName && typeof req.body.userName !== 'string')
    return res.status(400).json({
      status: 'Fails',
      message: 'Data invalid',
    });
  if (req.body.name && typeof req.body.name !== 'string')
    return res.status(400).json({
      status: 'Fails',
      message: 'Data invalid',
    });
  if (req.body.email && typeof req.body.email !== 'string')
    return res.status(400).json({
      status: 'Fails',
      message: 'Data invalid',
    });

  next();
};
const updateUser = asyncCatch(async (req, res, next) => {
  //The schema validate doesn't check type for String in this case i set name = 1(number) but it's still pass so to do it you need create middleware to check for this
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!user) return next(new AppError('This user is not exits', 400));
  res.status(200).json({
    status: 'Success',
    data: {
      user,
    },
  });
});
const deleteUser = asyncCatch(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('This user is not exits', 400));
  res.status(204).json({
    status: 'Success',
    data: null,
  });
});
//get users from a ciyt
//1, convert ob -> arr
//2, select the city element
//3, find with this element use condition
const getUserByCity = asyncCatch(async (req, res) => {
  const { city } = req.params;
  console.log(city);
  const users = await User.aggregate([
    {
      $project: {
        _id: 0,
        name: 1,
        username: 1,
        email: 1,
        phone: 1,
        address: { $objectToArray: '$address' },
      },
    },
    {
      $unwind: {
        path: '$address',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: { 'address.k': 'city', 'address.v': `${city}` },
    },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      users,
    },
  });
});

//Alias route for top 3 users: based on interaction, more likes, shares, sreachs, views,....
//1, we need embed posts data to users
//2, we based on posts data to count total likes, shares,  views,  with posts
//3, based on the above data we create new fieald totalLikes, shares, views,... => sort limit

/**
 * Filter all not allow data out of object data
 *
 * @param {Object} ob - The object need to filter
 * @param  {Array} fields - The fields array constain all allow fields
 * @returns
 */
const filterObject = (ob, ...fields) => {
  const filteredOb = {};
  Object.keys(ob).forEach(field => {
    if (fields.includes(field)) filteredOb[field] = ob[field];
  });
  return filteredOb;
};

/**
 * Allow user can update the current user data
 *
 * Condition: user must to login
 *
 * @param {Function} asyncCatch - The async funtion like try catch block
 * @returns {Function} middlewareFunction - The middleware function
 */
const updateMe = asyncCatch(async (req, res, next) => {
  const filteredBody = filterObject(req.body, 'name', 'email');

  const userUpdate = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: userUpdate,
    },
  });
});

/**
 * Allow user can delete userself
 *
 * Condition: user must to login, choose reason, re-enter password to confirm
 *
 * @param {Function} asyncCatch - The async funtion like try catch block
 * @returns {Function} middlewareFunction - The middleware function
 */
const deleteMe = asyncCatch(async (req, res, next) => {
  const { currentPassword, reason } = req.body;
  if (!reason)
    return next(
      new AppError('Please choose your reason to delete this account', 400),
    );
  if (!currentPassword)
    return next(new AppError('Please re-enter your password to confirm', 400));
  const user = await User.findById(req.user.id).select('+password');
  const check = await user.checkPassword(currentPassword, user.password);
  if (!check) return next(new AppError('Your password is not correct', 401));

  user.active = false;
  user.reasonDeleleAccount = reason;
  await user.save({ validateBeforeSave: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkReqBodyStringType,
  getUserByCity,
  updateMe,
  deleteMe,
};
