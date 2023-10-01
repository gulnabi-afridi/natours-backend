const express = require("express");
const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");

const app = express();
// 👉 midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serving the static pages ----------->
app.use(express.static(`${__dirname}/public`));

// environment varialbe ------------>

// console.log(process.env);

// 👉 for this "/api/v1/tours" route  we will apply the tourRouter middleware
app.use("/api/v1/tours", tourRouter); // the tourRouter middleware will only apply on tour route
app.use("/api/v1/users", userRouter);

module.exports = app;
