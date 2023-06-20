const express = require("express");

const router = express.Router();

const getAllUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "this route is not defined yet",
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "this route is not defined yet",
  });
};
const creatNewUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "this route is not defined yet",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "this route is not defined yet",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    // 500 status code mean internal server error
    status: "fail",
    message: "this route is not defined yet",
  });
};

router.route("/").get(getAllUser).post(creatNewUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
