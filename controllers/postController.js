const Post = require('../models/postModel');
// const APIFeature = require('../utils/apiFeatures');
const asyncCatch = require('../utils/asyncCatch');
const AppError = require('../utils/appError');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
  checkAliasStatsRoutes,
} = require('./handlerFactory');
const User = require('../models/userModel');

const checkUserId = asyncCatch(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    req.body.filter = {};
    return next();
  }
  const checkUserExist = await User.findById(userId);
  if (!checkUserExist)
    return next(new AppError('No user found with this id', 404));
  req.body.filter = { author: userId };
  next();
});
const getAllPosts = getAll(Post);

const setUserId = (req, res, next) => {
  req.body.author = req.user.id;
  next();
};

const createPost = createOne(Post);

const calcViewer = asyncCatch(async (req, res, next) => {
  const { id } = req.params;
  if (checkAliasStatsRoutes(id)) return next();
  const post = await Post.findById(id);
  post.viewers += 1;
  await post.save();
  next();
});

const getPost = getOne(Post);
const updatePieceOfPost = updateOne(Post);
const deletePost = deleteOne(Post);

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

const updatePost = asyncCatch(async (req, res, next) => {
  console.log(typeof req.body.name);
  //The schema validate doesn't check type for String in this case i set name = 1(number) but it's still pass so to do it you need create middleware to check for this
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!post) return next(new AppError('Invalid id', 400));
  res.status(200).json({
    status: 'Success',
    data: {
      post,
    },
  });
});
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
const getPostsStats = asyncCatch(async (req, res, next) => {
  // const plan = await Post.aggregate([
  //   {
  //     $match: { author: '64f2dfea184efc6c2d459578' },
  //   },
  // ]);
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
        author: '$_id',
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

  console.log(plan);
  res.status(200).json({
    status: 'Success',
    results: plan.length,
    data: {
      plan,
    },
  });
});

// const setAroundUsers = asyncCatch(async (req, res, next) => {
//   req.aroundUsers = aroundUsers;
// });

const getPostsAroundUser = asyncCatch(async (req, res, next) => {
  const aroundPostsPromises = req.aroundUsers.map(user =>
    Post.find({ author: user._id }),
  );
  const aroundPosts = await Promise.all(aroundPostsPromises);
  const formatAroundPosts = aroundPosts.flat();

  res.json({
    status: 'success',
    results: formatAroundPosts.length,
    data: {
      data: formatAroundPosts,
    },
  });
});

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
  setUserId,
  checkUserId,
  calcViewer,
  getPostsAroundUser,
};
