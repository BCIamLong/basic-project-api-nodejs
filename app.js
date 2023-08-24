const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const routerPosts = require('./routes/postRoutes');
const routerUsers = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const errorHanler = require('./middlewares/error');

const app = express();

app.use(helmet());

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
app.use(bodyParser.json({ limit: '90kb' }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//router
app.use('/api/v1/posts', routerPosts);
app.use('/api/v1/users', routerUsers);

// handle for not defined route
app.all('*', (req, res, next) => {
  // const err = new AppError(`Error for link ${req.originalUrl}`, 404);
  next(new AppError(`Error for link ${req.originalUrl}`, 404));
});

app.use(errorHanler);

module.exports = app;
