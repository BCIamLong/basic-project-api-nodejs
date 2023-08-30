const express = require('express');
const {
  getAllComments,
  createComment,
} = require('../controllers/commentController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllComments)
  .post(protect, restrictTo('user'), createComment);

module.exports = router;
