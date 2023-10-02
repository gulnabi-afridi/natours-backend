const Tour = require("./../models/tourModel");

// =====> methodes

exports.getAllTours = async (req, res) => {
  try {
    // filtering the tour
    // buid query
    // 1A.) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query);

    // 1B.) Advanced filtering
    // the query would be like that 👇
    // {difficulty:'easy',duration:{$gte:5}}
    //   but we got in that form 👇
    // {difficulty:'easy',duration:{gte:5}}  // so we have to add with req.query the $ sign
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    // we created the query
    let query = Tour.find(JSON.parse(queryString));

    // 2) sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
      //-----> provide in that form 👉 sort('price ratingAverage')
    } else {
      query = query.sort("-createdAt");
    }

    // 3) Field Limiting
    if (req.query.fields) {
      // query = query.select('name duration price') accept in that format
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // excluding v
    }

    // pagination
    // page=2&limit=5  1-5 page 1 , 6-10 page 2 , 11-15 page 3 👇
    // we need page 2 so we have to skip 5 document and starts from 6
    // query = query.skip(2).limit(5)

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page does not exist");
    }

    query = query.skip(skip).limit(limit);

    // execute query
    const tours = await query;

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
    res.status(404).json({
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
        message: "New Tour Created",
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
