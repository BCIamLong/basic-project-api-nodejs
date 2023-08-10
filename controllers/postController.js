const Post = require('../models/postModel');
const APIFeature = require('../utils/apiFeatures');

const getAllPosts = async (req, res) => {
  try {
    const count = await Post.countDocuments({});
    const apiFeatures = new APIFeature(Post.find(), req.query)
      .sort()
      .select()
      .pagination(count);
    const posts = await apiFeatures.query;

    res.status(200).json({
      status: 'Success',
      data: {
        posts,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fails',
      message: 'posts data not found',
      error: err,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);

    res.status(201).json({
      status: 'Success',
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fails',
      message: 'Data invalid',
      error: err,
    });
  }
};
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json({
      status: 'Success',
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fails',
      message: 'post data not found',
      error: err,
    });
  }
};

const checkReqBodyStringType = (req, res, next) => {
  if (req.body.title && typeof req.body.title !== 'string')
    return res.status(400).json({
      status: 'Fails',
      message: 'Data invalid',
    });
  if (req.body.body && typeof req.body.body !== 'string')
    return res.status(400).json({
      status: 'Fails',
      message: 'Data invalid',
    });
  if (req.body.author && typeof req.body.author !== 'string')
    return res.status(400).json({
      status: 'Fails',
      message: 'Data invalid',
    });

  next();
};
const updatePieceOfPost = async (req, res) => {
  try {
    console.log(typeof req.body.name);
    //The schema validate doesn't check type for String in this case i set name = 1(number) but it's still pass so to do it you need create middleware to check for this
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fails',
      message: 'Data invalid',
      error: err,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    console.log(typeof req.body.name);
    //The schema validate doesn't check type for String in this case i set name = 1(number) but it's still pass so to do it you need create middleware to check for this
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fails',
      message: 'Data invalid',
      error: err,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fails',
      message: 'Invalid id',
      error: err,
    });
  }
};

//Alias route for top 5 more likes and more shares hot posts
const aliasTop5MoreLikesPosts = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-likes';

  next();
};
const aliasTop5MoreSharesPosts = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-shares';

  next();
};

//! STATISTICS POSTS: BY author
const getPostsStats = async (req, res) => {
  try {
    const plan = await Post.aggregate([
      {
        $group: {
          _id: '$author',
          totalLikes: { $sum: '$likes' },
          totalShares: { $sum: '$shares' },
          posts: {
            $push: {
              // $slice: [{ $split: ['$title', ' '] }, 2],
              $toUpper: '$title',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          totalLikes: 1,
          totalShares: 1,
          posts: 1,
          fammous: { $add: ['$totalLikes', '$totalShares'] },
        },
      },
      {
        $sort: { fammous: -1 },
      },
      {
        $limit: 10,
      },
    ]);
    res.status(200).json({
      status: 'Success',
      results: plan.length,
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fails',
      message: "Can'\t request",
      error: err,
    });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPost,
  updatePieceOfPost,
  updatePost,
  deletePost,
  checkReqBodyStringType,
  aliasTop5MoreLikesPosts,
  aliasTop5MoreSharesPosts,
  getPostsStats,
};
