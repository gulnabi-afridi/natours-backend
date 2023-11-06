const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'this route is not defined yet',
  });
};
exports.creatNewUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'this route is not defined yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'this route is not defined yet',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    // 500 status code mean internal server error
    status: 'fail',
    message: 'this route is not defined yet',
  });
};
