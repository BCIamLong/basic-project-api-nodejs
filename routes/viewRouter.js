const express = require('express');
const {
  getOverview,
  getPost,
  getLogin,
  getSignup,
  logout,
  getAccount,
  getUser,
  getWelcomeEmail,
} = require('../controllers/viewsController');
const { isLoggedIn } = require('../controllers/authController');

const router = express.Router();

router.get('/login', getLogin);
router.get('/signup', getSignup);

router.use(isLoggedIn);
// ! Notice that when we use middleware have return if that middleware is endpoint it's not problem but if that middleware is some middleware in req, res cycle that's problem
// ! because if that middleware code error, and in the first time run request we don't have any data to check and therefore the error will always occurs and will return what we check
// * like if(!req.user) return 'Not user logging'; and we will get this message in this example
// router.use(isLoggedIn2);//! therefore this code is not use because it'll redirect all the time, run first it'll call the function then error => then send request /login call server again then error => ... it'll loop until our request limit number

router.get('/', getOverview);
router.get('/posts/:postId', getPost);
router.get('/logout', logout);
router.get('/account', getAccount);
router.get('/users/:username', getUser);
router.get('/email/welcome', getWelcomeEmail);

module.exports = router;
