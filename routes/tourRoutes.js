const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();
// The param method is used to define middleware that will be executed whenever a specific parameter, in this case, "id," is present in the URL path. It allows you to extract and process the value of the specified parameter before passing control to the next middleware or route handler.
// val: This is the value of the "id" parameter extracted from the URL.
// After logging the tour ID, the next() function is called to pass control to the next middleware or route handler in the chain. This allows subsequent middleware functions or the final route handler to continue processing the request.

// router.param("id", (req, res, next, val) => {
//   console.log(`tour id id ${val}`);
//   next();
// });

// POST /tour/2343/reviews
// GET /tour/6282822/reviews
// GET /tour/27228282/reviews/73889272

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   );

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/yearly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  //   ====> chaining of multiple midleware
  .post(tourController.createNewTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.DeleteTour,
  );

module.exports = router;
