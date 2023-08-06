const express = require("express");
const {
  getAllPosts,
  createPost,
  getPost,
  updatePieceOfPost,
  updatePost,
  deletePost,
  checkReqBodyStringType,
} = require("./../controllers/postController");

const router = express.Router();

// router.param("id", checkID);

router.route("/").get(getAllPosts).post(createPost);
router
  .route("/:id")
  .get(getPost)
  .patch(checkReqBodyStringType, updatePieceOfPost)
  .put(updatePost)
  .delete(deletePost);

module.exports = router;
