const express = require('express');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError');
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
  // whenever we pass argument from the next it will automatically detect there is an error and it will escape all the midleware and would call the global error handle middleware.
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

//

app.use((err, req, res, next) => {
  console.log(`${err.stack} 🔥`);
  err.statusCode = err.statusCode || 500; // 500 mean internal server error
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
