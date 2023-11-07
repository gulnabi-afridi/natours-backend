const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });
  return newObject;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user posts password data

  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password update. please use /updateMyPassword',
        400,
      ),
    );
  }
  // filtered out unwanted fields names that are not allowed to be updated.
  const filterBody = filterObj(req.body, 'name', 'email');
  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
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
