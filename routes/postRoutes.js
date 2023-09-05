const express = require('express');
const commentRouter = require('./commentRouter');
const {
  getAllPosts,
  createPost,
  getPost,
  updatePieceOfPost,
  // updatePost,
  deletePost,
  // checkReqBodyStringType,
  aliasTop5MoreLikesPosts,
  aliasTop5MoreSharesPosts,
  getPostsStats,
  setUserId,
  checkUserId,
  calcViewer,
  getPostsAroundUser,
} = require('../controllers/postController');
const { protect, restrictTo } = require('../controllers/authController');
const { getAroundUsers } = require('../controllers/userController');

const router = express.Router({ mergeParams: true });

router.use('/:postId/comments', commentRouter);

router.get('/', checkUserId, getAllPosts);
router
  .route('/top-5-more-likes-posts')
  .get(aliasTop5MoreLikesPosts, getAllPosts);
router
  .route('/top-5-more-shares-posts')
  .get(aliasTop5MoreSharesPosts, getAllPosts);
// router.param("id", checkID);
router.route('/:id').get(calcViewer, getPost);

router.use(protect); //! routes after this be logged in to get access

router.get('/around-posts', getAroundUsers, getPostsAroundUser);
//Alias route
//1,top 5 more likes posts
// router.get('/top-5-more-likes-posts', aliasTop5MoreLikesPosts, getAllPosts);

//Statistics of post by author

router.route('/').post(protect, setUserId, createPost);
router
  .route('/:id')
  .patch(updatePieceOfPost)
  // .put(updatePost)
  .delete(deletePost);

router.use(restrictTo('admin')); //! routes after this only for admin

router.route('/posts-stats').get(getPostsStats);

module.exports = router;
