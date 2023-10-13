const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// =====> methodes

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  // -ratingsAverage = descending order
  // ratingsAverage = asending order
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  // execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    message: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    // new 👉 true to return the modified document rather than the original.
    new: true,
    // runValidators 👉 on this command update validators validate the update operation against the model schema
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('cant find tour with that id', 404));
  }
  res.status(200).json({
    message: 'success',
    tour,
  });
});

exports.DeleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(204).json({
    //204 mean content not fount
    message: 'successfully deleted',
    data: null,
  });
});

exports.createNewTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    data: {
      message: 'New Tour Created',
      tour: newTour,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: "$ratingsAverage",
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // 1 mean in acseding order
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);
  res.status(200).json({
    message: 'success',
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year;
  const plane = await Tour.aggregate([
    {
      $unwind: '$startDates', // The $unwind stage is used to deconstruct an array field within documents in a collection and create separate documents for each element of the array.
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0, // 0 will hide the id and 1 will show the id.
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      // $limit: 6, //this is show only 6 document
    },
  ]);

  res.status(200).json({
    message: 'success',
    data: {
      result: plane.length,
      data: plane,
    },
  });
});
