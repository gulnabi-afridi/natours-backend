const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// function for generating the token

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist.
  if (!email || !password) {
    // 400 mean bad request
    return next(new AppError('please provide email and password', 400));
  }
  // 2) check if the user exists && password is correct.

  // password are not select then we have to select in the below way.
  const user = await User.findOne({ email }).select('+password');

  // now we have to compare the password ...

  if (!user || !(await user.correctPassword(password, user.password))) {
    // 401 mean unauthorized user
    return next(new AppError('Incorrect email or password', 401));
  }
  // If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

// protecting routes .............
exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('you are not logged in!! please log in to get access.', 401),
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // that decoded will gave use
  // a) user id
  // b) created at
  // c) expires at

  // 3) check if user still exits...

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  // 4) check if user changed password after the token was issued.
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recentky changed password!! Please log in again.',
        401,
      ),
    );
  }

  // Grant access to protected route.
  req.user = currentUser;
  next();
});

// we cant pass directly through the midleware an arguments. thats why we warapped the middleware in a wrapper.
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // we passed the roles in that form ['admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        // 403 mean forbidden
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

// forgot password ------------->

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on POSTED email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  // 2) Generate the random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3 send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your passowrd? Submit a PATCH request with new password and passwordConfirm to: ${resetURL}. If you didn't forget your passowrd, please ignore this email!!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!!',
        500,
      ),
    );
  }
});

// reset password ------------->

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on the token

  const hasedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hasedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password

  if (!user) {
    // 400 mean bad request.
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: true });

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

// update password ---------->

exports.updatePassword = async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted current password is correct

  if (!(await user.correctPassword(req.body.passwordConfirm, user.password))) {
    return next(new AppError('your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // 4) Log user in , send JWT
};
