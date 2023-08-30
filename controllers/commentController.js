const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const AppError = require('../utils/appError');
const asyncCatch = require('../utils/asyncCatch');

const getAllComments = asyncCatch(async (req, res, next) => {
  const { postId } = req.params;
  const filteredOb = {};
  if (postId) {
    const checkPostExist = await Post.findById(postId);
    if (!checkPostExist) return next(new AppError('Post id invalid'));
    filteredOb.post = postId;
  }

  const commets = await Comment.find(filteredOb);

  res.json({
    status: 'success',
    data: {
      commets,
    },
  });
});

const createComment = asyncCatch(async (req, res, next) => {
  const { postId } = req.params;
  const checkPostExist = await Post.findById(postId);
  if (!checkPostExist) return next(new AppError('Post id invalid', 401));

  const newComment = await Comment.create({
    post: postId,
    author: req.user.id,
    content: req.body.content,
  });

  res.status(201).json({
    status: 'success',
    data: {
      commet: newComment,
    },
  });
});

module.exports = { getAllComments, createComment };
