const express = require('express');
const commentRouter = require('./commentRouter');
const {
  getAllPosts,
  createPost,
  getPost,
  updatePieceOfPost,
  updatePost,
  deletePost,
  // checkReqBodyStringType,
  aliasTop5MoreLikesPosts,
  aliasTop5MoreSharesPosts,
  getPostsStats,
} = require('../controllers/postController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.use('/:postId/comments', commentRouter);

//Alias route
//1,top 5 more likes posts
router
  .route('/top-5-more-likes-posts')
  .get(aliasTop5MoreLikesPosts, getAllPosts);

//2, top 5 more share posts
router
  .route('/top-5-more-shares-posts')
  .get(aliasTop5MoreSharesPosts, getAllPosts);
// router.param("id", checkID);

//Statistics of post by author
router
  .route('/posts-stats')
  .get(protect, restrictTo('admin', 'manager'), getPostsStats);

router.route('/').get(protect, getAllPosts).post(protect, createPost);
router
  .route('/:id')
  .get(getPost)
  .patch(protect, updatePieceOfPost)
  .put(updatePost)
  .delete(protect, deletePost);

module.exports = router;
