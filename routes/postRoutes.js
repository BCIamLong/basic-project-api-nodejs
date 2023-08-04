const express = require("express");
const {
  getAllPosts,
  createPost,
  getPost,
  updatePieceOfPost,
  updatePost,
  deletePost,
  checkID,
  checkPosts,
  checkReqBody,
} = require("./../controllers/postController");

const router = express.Router();

router.param("id", checkID);

router.route("/").get(checkPosts, getAllPosts).post(checkReqBody, createPost);
router
  .route("/:id")
  .get(getPost)
  .patch(updatePieceOfPost)
  .put(updatePost)
  .delete(deletePost);

module.exports = router;
