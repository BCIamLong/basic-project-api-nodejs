const User = require('../models/userModel');
// const APIFeature = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const asyncCatch = require('../utils/asyncCatch');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

// const setActionGetUser = (req, res, next) => {
//   req.body.action = 'getUser';
//   next();
// };
const getAllUsers = getAll(User);
const getUser = getOne(User);
const createUser = createOne(User);
const updateUser = updateOne(User);
const deleteUser = deleteOne(User);

const setCurrentUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
const getMe = getOne(User);

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
// location: {
//   type: {
//     type: String,
//     default: 'Point',
//     enum: ['Point'],
//   },
//   coordinates: [Number],
//   address: String,
// },
const setCurrentLocation = asyncCatch(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.location.coordinates)
    return next(new AppError('You turned on location', 400));
  // console.log(req.body.coordinates);
  const [lat, lng] = req.body.coordinates;
  req.body = {
    location: {
      type: req.body.type,
      coordinates: [lng, lat],
      address: req.body.address,
    },
  };

  next();
});
// const checkCurrentLocation = asyncCatch(async (req, res, next) => {
//   const user = await User.findById(req.user.id);
//   if (user.location.coordinates.length === 0)
//     return next(new AppError('You dont turn on your location yet', 400));
//   req.body = { location: undefined };
//   next();
// });

const turnOnCurrentLocation = updateOne(User);
const turnOffCurrentLocation = asyncCatch(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user.location.coordinates)
    return next(new AppError('You dont turn on your location yet', 400));
  user.location = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getAroundUsers = asyncCatch(async (req, res, next) => {
  if (!req.user.location.coordinates)
    return next(
      new AppError('Please turn on your location to perform this feature', 400),
    );
  const [lng, lat] = req.user.location.coordinates;
  const radius = 300 / 3963.2; // mi unit if it km unit you need divide to 6371 km
  const aroundUsers = await User.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
    _id: { $ne: req.user.id },
  }).select('-role -joinedAt');

  if (req.url === '/around-posts') {
    req.aroundUsers = aroundUsers;
    return next();
  }
  res.json({
    status: 'success',
    data: {
      data: aroundUsers,
    },
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
  // setActionGetUser,
  setCurrentUserId,
  getMe,
  turnOnCurrentLocation,
  setCurrentLocation,
  turnOffCurrentLocation,
  // checkCurrentLocation,
  getAroundUsers,
};
