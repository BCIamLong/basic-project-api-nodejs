const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const routerPosts = require('./routes/postRoutes');
const routerUsers = require('./routes/userRoutes');
const routerComments = require('./routes/commentRouter');
const routerViews = require('./routes/viewRouter');
const AppError = require('./utils/appError');
const errorHanler = require('./middlewares/error');

const app = express();

app.use(compression({ level: process.env.COMPRESSION_LEVEL }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet({ contentSecurityPolicy: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
  handler: (req, res, next) =>
    res.status(429).json({
      status: 'fails',
      message: 'Too much request sent, please wait to send again',
    }),
});
app.use(limiter);
//middleware
// app.use(express.static(``));
// app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '90kb' }));
app.use(bodyParser.urlencoded({ limit: '90kb', extended: true }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//router web server
app.use('/', routerViews);

//router api
app.use('/api/v1/posts', routerPosts);
app.use('/api/v1/users', routerUsers);
app.use('/api/v1/comments', routerComments);

// handle for not defined route
app.all('*', (req, res, next) => {
  // const err = new AppError(`Error for link ${req.originalUrl}`, 404);
  next(new AppError(`Error for link ${req.originalUrl}`, 404));
});

app.use(errorHanler);

module.exports = app;
