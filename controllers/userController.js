const User = require('../models/userModel');
const APIFeature = require('../utils/apiFeatures');

const getAllUsers = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'Fails',
      message: 'Users data not found',
      error: err,
    });
  }
};
const getUser = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    console.log(`Companny info: ${user.compannyInfo}`);
    res.status(200).json({
      status: 'Success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fails',
      message: 'User data not found',
      error: err,
    });
  }
};
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'Success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fails',
      message: 'Data invalid',
      error: err,
    });
  }
};
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
const updateUser = async (req, res) => {
  try {
    console.log(typeof req.body.name);
    //The schema validate doesn't check type for String in this case i set name = 1(number) but it's still pass so to do it you need create middleware to check for this
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fails',
      message: 'Data invalid',
      error: err,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fails',
      message: 'Invalid id',
      error: err,
    });
  }
};
//get users from a ciyt
//1, convert ob -> arr
//2, select the city element
//3, find with this element use condition
const getUserByCity = async (req, res) => {
  try {
    const city = req.params.city;
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
  } catch (err) {
    res.status(400).json({
      status: 'Fails',
      message: 'Bad request',
      error: err.message,
    });
  }
};

//Alias route for top 3 users: based on interaction, more likes, shares, sreachs, views,....
//1, we need embed posts data to users
//2, we based on posts data to count total likes, shares,  views,  with posts
//3, based on the above data we create new fieald totalLikes, shares, views,... => sort limit

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkReqBodyStringType,
  getUserByCity,
};
