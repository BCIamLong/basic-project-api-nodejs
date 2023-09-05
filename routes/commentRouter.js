const express = require('express');
const {
  getAllComments,
  createComment,
  deleteComment,
  updateComment,
  setUserPostId,
  checkPostId,
  getComment,
  checkAllowUserDelete,
} = require('../controllers/commentController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect); //! routes after this be logged in to get access

// router.post('/', restrictTo('user'), setUserPostId, createComment);

router.use(restrictTo('user', 'admin')); //! routes after this only for admin and user

router
  .route('/')
  .get(checkPostId, getAllComments)
  .post(setUserPostId, createComment);
router
  .route('/:id')
  .get(getComment)
  .patch(updateComment)
  .delete(checkAllowUserDelete, deleteComment);

module.exports = router;
