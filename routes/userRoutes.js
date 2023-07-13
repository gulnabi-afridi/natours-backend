const express = require("express");
const {
  getAllUser,
  creatNewUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getAllUser).post(creatNewUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
