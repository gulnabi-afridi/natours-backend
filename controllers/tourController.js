const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// =====> methodes

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  // -ratingsAverage = descending order
  // ratingsAverage = asending order
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // preparing query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // execute query
  const tours = await features.query;

  res.status(200).json({
    message: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

//{ path: 'reviews' , select:'name' } which you want to populate we can also pass the select option.
exports.getTourById = factory.getOne(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour);
exports.DeleteTour = factory.deleteOne(Tour);
exports.createNewTour = factory.createOne(Tour);

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
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    message: 'success',
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
