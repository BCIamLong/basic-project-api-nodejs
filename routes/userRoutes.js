const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkReqBodyStringType,
} = require('./../controllers/userController');
const router = express.Router();

//Alias top 3 users hot
router.route('/top-3-hot-users').get(getAllUsers);

// router.param("id", checkID);

router.route('/').get(getAllUsers).post(createUser);
router
  .route('/:id')
  .get(getUser)
  .patch(checkReqBodyStringType, updateUser)
  .delete(deleteUser);

module.exports = router;
