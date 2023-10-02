const express = require("express");
const tourController = require("../controllers/tourController");

const router = express.Router();

// The param method is used to define middleware that will be executed whenever a specific parameter, in this case, "id," is present in the URL path. It allows you to extract and process the value of the specified parameter before passing control to the next middleware or route handler.
// val: This is the value of the "id" parameter extracted from the URL.
// After logging the tour ID, the next() function is called to pass control to the next middleware or route handler in the chain. This allows subsequent middleware functions or the final route handler to continue processing the request.

// router.param("id", (req, res, next, val) => {
//   console.log(`tour id id ${val}`);
//   next();
// });

router
  .route("/")
  .get(tourController.getAllTours)
  //   ====> chaining of multiple midleware
  .post(tourController.createNewTour);

router
  .route("/:id")
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.DeleteTour);

module.exports = router;
