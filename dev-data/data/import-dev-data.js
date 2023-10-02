const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("../../models/tourModel");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// =============================connection with database====================================
// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

const LOCALDATABASE = process.env.DATABASE_LOCAL;

mongoose.connect(LOCALDATABASE, {}).then((con) => {
  // console.log(con.connections);
  console.log("DB connection successfully created");
});

// ===> read the json file

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

//  import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded!");
    process.exit();
  } catch (err) {
    console.log(err, "error related to importing the all tours to database 🔥");
  }
};

// delete all data from DB

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted!");
    process.exit();
  } catch (err) {
    console.log(err, "All Tour deleted 🙌");
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
