const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  // checkReqBodyStringType,
  getUserByCity,
  updateMe,
  deleteMe,
} = require('../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../controllers/authController');

const router = express.Router();

router.patch('/update-me', protect, updateMe);
router.delete('/delete-me', protect, deleteMe);

router.patch('/update-password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.post('/signup', signup);
router.post('/login', login);

//Alias top 3 users hot
router.route('/top-3-hot-users').get(getAllUsers);

//get user from a city
router.route('/city-users/:city').get(getUserByCity);

// router.param("id", checkID);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
