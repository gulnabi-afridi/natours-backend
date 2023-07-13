const Tour = require("./../models/tourModel");

// =====> methodes
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      message: "success",
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // new 👉 true to return the modified document rather than the original.
      new: true,
      // runValidators 👉 on this command update validators validate the update operation against the model schema
      runValidators: true,
    });
    res.status(200).json({
      message: "success",
      tour,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.DeleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      //204 mean content not fount
      message: "successfully deleted",
      data: null,
    });
  } catch (err) {
    res.json({
      status: "fail",
      message: err,
    });
  }
};

exports.createNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    //400 mean bad request
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
