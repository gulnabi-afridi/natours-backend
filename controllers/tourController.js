const fs = require("fs");

// ======> reading data
// 👇 we have to parse the JSON to javascript object if not we will get in response the data in buffer form
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkedId = (req, res, next, val) => {
  console.log(`tour id is ${val}`);
  const id = req.params.id * 1;
  if (id > toursData.length) {
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }
  next();
};

// ====> checked the body

exports.checkBody = (req, res, next) => {
  //   console.log(req.body.name);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      // 400 mean bad request
      status: "fail",
      message: "missing name or price",
    });
  }
  next();
};

// =====> methodes
exports.getAllTours = (req, res) => {
  res.status(200).json({
    message: "success",
    result: toursData.length,
    data: toursData,
  });
};

exports.getTourById = (req, res) => {
  // we can define multiple params like /api/v1/tours/:id/:x/:y
  // we can make some parameter optional too like /api/v1/tours/:id/:x/:y?

  // console.log(req.params);
  const id = req.params.id * 1;
  const tour = toursData.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    message: "success",
    data: "<updated tour data here......>",
  });
};

exports.DeleteTour = (req, res) => {
  res.status(204).json({
    //204 mean content not fount
    message: "successfully deleted",
    data: null,
  });
};

exports.createNewTour = (req, res) => {
  // console.log(req.body);
  // 👉 lets add the body object to our tours json

  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  // console.log(newTour);
  toursData.push(newTour);

  // 👉 now writing the latest toursData in the tours json file

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (error) => {
      res.status(201).json({
        // 201 mean created successfully
        status: "success",
        data: {
          newTour,
        },
      });
    }
  );
};
