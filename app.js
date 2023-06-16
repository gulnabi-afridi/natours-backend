const express = require("express");
const fs = require("fs");

const app = express();
// 👉 midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======> reading data
// 👇 we have to parse the JSON to javascript object if not we will get in response the data in buffer form
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`)
);

// ====> api routes
app.get("/api/v1/tours", (req, res) => {
  // overlaping the toursdata in other object with status code
  res.status(200).json({
    message: "success",
    result: toursData.length,
    data: toursData,
  });
});

// =====> post request
// 👉 express doesn't put the body data to the request for that we have to use the middleware. If we not defined the middleware then we will get the empty object.

app.post("/api/v1/tours", (req, res) => {
  // console.log(req.body);
  // 👉 lets add the body object to our tours json

  const newId = toursData[toursData.length - 1]._id + 1;
  const newTour = Object.assign({ _id: newId }, req.body);
  // console.log(newTour);
  toursData.push(newTour);

  // 👉 now writing the latest toursData in the tours json file

  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
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
});

// port

const port = 3000;

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
