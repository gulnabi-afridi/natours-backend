const express = require('express');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

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
  res.status(404).send({
    status: 'fail',
    message: `can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
