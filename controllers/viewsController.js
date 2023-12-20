const mongoose = require('mongoose');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const asyncCatch = require('../utils/asyncCatch');

const getWelcomeEmail = (req, res) => {
  res.render('email/welcome');
};

const getUser = asyncCatch(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  const posts = await Post.find({ author: user.id }).select('+createdAt');
  const title = `Media | ${user.name}`;
  res.status(200).render('user', { title, posts, user });
});

const getAccount = asyncCatch(async (req, res) => {
  if (!res.locals.user) return res.redirect('login');
  const accId = res.locals.user.id;
  const posts = await Post.find({ author: accId }).select('+createdAt');
  const users = await User.aggregate([
    {
      // ! notice that when work with $match stage aggregate in MongoDB we need to convert the id when we are using mongoose why? because MongoDB is not automatically set up it like mongoose
      // * therefore keep in mind that if we work with both mongoDB and mongoose library jS driver
      $match: { _id: { $ne: new mongoose.Types.ObjectId(accId) } },
    },
    {
      $sample: { size: 3 },
    },
  ]);
  res.status(200).render('account', { title: 'Media | Account', posts, users });
});

const logout = (req, res) => {
  //* we need to set the cookie with expires very short because res.clearCookie only clear value not clear jwt cookie variable
  // * therefore we need set expires very short and after this time it'll be totally deleted
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(Date.now() + 3000),
  });
  res.clearCookie('jwt');
  res.redirect('/');
};

const getSignup = asyncCatch(async (req, res, next) => {
  res.status(200).render('signup', { title: 'Media | Sign up' });
});

const getLogin = asyncCatch(async (req, res, next) => {
  res.status(200).render('login', { title: 'Media | Login' });
});

const getPost = asyncCatch(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).select('+createdAt');

  const title = `Post | "${post.title}"`;
  res.status(200).render('post', { title, post });
});

const getOverview = asyncCatch(async (req, res) => {
  // ! Other way to random that's random documents array we get after we user find()
  // ! then set up the num: use count of documents - limit(9)
  // ! then loop from count-9 to 9 then create random num= Math.floor(Math.random()*count)
  // const count = await Post.countDocuments();
  // const randomNum = Math.floor(Math.random() * count);
  // const posts = await Post.find().select('+createdAt');

  // let arrPosts;
  // if (randomNum > 9) arrPosts = posts.splice(randomNum - 9, randomNum);
  // else arrPosts = posts;
  // const postsResult = arrPosts.map(post => {
  //   const randomNum2 = Math.floor(Math.random() * 9);
  //   return arrPosts[randomNum2];
  // });
  // console.log(postsResult);
  // const posts = await Post.find().limit(9).skip(skip);
  // const posts = await Post.find().select('+createdAt');

  const posts = await Post.aggregate([
    {
      $sample: { size: 9 },
    },
    {
      $lookup: {
        from: 'users',
        // let: { role_valid: '$role' },
        // pipeline: [{ $match: { role_valid: 'user' } }],
        localField: 'author',
        foreignField: '_id',
        as: 'author',
      },
    },
  ]);
  // const authors = posts.filter(post => post.author !== []);
  // console.log(authors.length);
  // console.log(posts);
  // * get random document with mongoose
  // const count = await User.countDocuments();
  // const randomNum = Math.floor(Math.random() * count);
  // const skip = randomNum > 3 ? randomNum - 3 : randomNum;
  // const users = await User.find().limit(3).skip(skip);

  // * get random document for both MongoDB and mongoose
  const users = await User.aggregate([
    // {
    //   $match: { active: { $ne: false }, role: { $ne: 'admin' } },
    // },
    {
      // ! use aggregate $sample stage to get random document
      $sample: { size: 3 },
    },
  ]);
  if (!res.locals.user) return res.redirect('login');
  res.status(200).render('overview', { title: 'Social Media', posts, users });
});

module.exports = {
  getOverview,
  getPost,
  getLogin,
  getSignup,
  logout,
  getAccount,
  getUser,
  getWelcomeEmail,
};
