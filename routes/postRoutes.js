const express = require('express');
const {
  getAllPosts,
  createPost,
  getPost,
  updatePieceOfPost,
  updatePost,
  deletePost,
  checkReqBodyStringType,
  aliasTop5MoreLikesPosts,
  aliasTop5MoreSharesPosts,
} = require('./../controllers/postController');

const router = express.Router();

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

router.route('/').get(getAllPosts).post(createPost);
router
  .route('/:id')
  .get(getPost)
  .patch(checkReqBodyStringType, updatePieceOfPost)
  .put(updatePost)
  .delete(deletePost);

module.exports = router;
