const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// mergeParams = true why that
// By default each router only have access to the parameters of their specific routes. we want to get
// access to the tourId in the review Route thats why we have to true the mergeParams.
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview,
  );

module.exports = router;
