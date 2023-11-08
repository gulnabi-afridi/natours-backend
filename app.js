const express = require('express');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const e = require('express');

const app = express();
// 👉 Global midleware ------------------->
// set security HTTP headers
app.use(helmet());

// limit requests from same API
const limiter = rateLimit({
  // we allow 100 requests in a hour
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});

// this middleware will work for all the routes which starts from the /api.
app.use('/api', limiter);

// Body parser, reading data from body into req.body.
// if body is larger than 10Kb that would not be accepted.
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection.
// this will lookout at all req.body, params and will filter out and remove all the $sign.
app.use(mongoSanitize());

// Data sanitization against xss.
app.use(xss());

// Prevent parameter pollution ------------->
// whitelist mean for which we allowed the duplicate in the query string.
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'ratingsAverage',
      'difficulty',
      'ratingsQuantity',
      'maxGroupSize',
    ],
  }),
);

app.use(express.urlencoded({ extended: true }));

// serving the static files ----------2----->
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// environment varialbe ---------------->

// console.log(process.env);

// 👉 for this "/api/v1/tours" route  we will apply the tourRouter middleware
app.use('/api/v1/tours', tourRouter); // the tourRouter middleware will only apply on tour route
app.use('/api/v1/users', userRouter);

// 👉 HANDLE THE ROUTE WHICH ARE NOT DEFINED

app.all('*', (req, res, next) => {
  // 👉 BAD PRACTICE
  //  const err = new Error(`can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // 👉 GOOD PRACTICE
  // whenever we pass argument from the next it will automatically detect there is an error and it will escape all the midleware and would call the global error handle middleware.
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

// whenever there is four arguments of a middleware express will automatically detect its an error middleware. And upon error express will leave all the middleware and called that global one.
app.use(globalErrorHandler);

module.exports = app;
