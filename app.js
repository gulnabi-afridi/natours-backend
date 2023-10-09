const express = require('express');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const e = require('express');

const app = express();
// 👉 midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serving the static pages ----------->
app.use(express.static(`${__dirname}/public`));

// environment varialbe ------------>

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
