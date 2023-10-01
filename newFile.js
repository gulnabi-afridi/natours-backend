const {
  tourRouter,
  getTourById,
  updateTour,
  DeleteTour,
} = require("./goodApprouch");

tourRouter.route("/:id").get(getTourById).patch(updateTour).delete(DeleteTour);
