const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const AppError = require('../utils/appError');
const asyncCatch = require('../utils/asyncCatch');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

const checkPostId = asyncCatch(async (req, res, next) => {
  const { postId } = req.params;
  if (!postId) {
    req.body.filter = {};
    return next();
  }
  const checkPostExist = await Post.findById(postId);
  if (!checkPostExist)
    return next(new AppError('No post found with this id', 404));
  req.body.filter = { post: postId };

  next();
});

const getAllComments = getAll(Comment);

const setUserPostId = asyncCatch(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const checkPostExist = await Post.findById(postId);
  if (!checkPostExist)
    return next(new AppError('No post found with this id', 404));

  //* check limit comments: per user only have three comments on the post
  const checkLimitedUserComment = await Comment.find({
    author: userId,
    post: postId,
  });
  if (checkLimitedUserComment.length > 3)
    return next(new AppError('You only comment 3 times on a post', 403));

  req.body = {
    post: postId,
    author: userId,
    content: req.body.content,
  };
  next();
});
const createComment = createOne(Comment);

//* user only delete his comment and comment in his post, admin can delete all
const checkAllowUserDelete = asyncCatch(async (req, res, next) => {
  //req.user.id, req.params.id = comment
  if (req.user.role === 'admin') return next();
  const userId = req.user.id;
  const comment = await Comment.findById(req.params.id);
  const checkPostOfUser = await Post.findOne({
    author: userId,
    _id: comment.post,
  });
  // console.log(checkPostOfUser);

  if (!(userId === comment.author._id.toString() || checkPostOfUser))
    return next(
      new AppError('You dont have permission to delete this comment', 403),
    );

  next();
});

const deleteComment = deleteOne(Comment);
const getComment = getOne(Comment);
const updateComment = updateOne(Comment);

module.exports = {
  getAllComments,
  createComment,
  deleteComment,
  updateComment,
  setUserPostId,
  getComment,
  checkPostId,
  checkAllowUserDelete,
};
