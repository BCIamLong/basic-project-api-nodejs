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
  setCurrentUserId,
  getMe,
  turnOnCurrentLocation,
  setCurrentLocation,
  turnOffCurrentLocation,
  getAroundUsers,
  // checkCurrentLocation,
  // setActionGetUser,
} = require('../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
  logout,
} = require('../controllers/authController');
const postRouter = require('./postRoutes');

const router = express.Router();

router.use('/:userId/posts', postRouter);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.post('/signup', signup);
router.post('/login', login);

router.use(protect); //! routes after this be logged in to get access

router.get('/around-users', getAroundUsers);
router.patch(
  '/turn-on-current-location',
  setCurrentUserId,
  setCurrentLocation,
  turnOnCurrentLocation,
);
router.delete('/turn-off-current-location', turnOffCurrentLocation);

router.delete('/logout', logout);
router
  .route('/me')
  .get(setCurrentUserId, getMe)
  .patch(updateMe)
  .delete(deleteMe);
// router.patch('/update-me', protect, updateMe);
// router.delete('/delete-me', protect, deleteMe);

router.patch('/update-password', protect, updatePassword);

//Alias top 3 users hot
router.route('/top-3-hot-users').get(getAllUsers);

//get user from a city
router.route('/city-users/:city').get(getUserByCity);

// router.param("id", checkID);

router.use(restrictTo('admin')); //! routes after this only for admin

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
