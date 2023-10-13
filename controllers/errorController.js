const AppError = require('./../utils/appError');

//trying to accessing wrong ID tour.
const handleCastErrorDB = (err) => {
  const message = `Invaild ${err.path}: ${err.value}.`;
  return new AppError(message, 400); // 400 bad request client request are invalid
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. please use another value`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational , truested error: send messgae to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming or other unknown error: don't leak error details to client.
  } else {
    // 1) Log error
    console.log('Error 🔥', err);
    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong! 🔥',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // 500 mean internal server error
  err.status = err.status || 'error';

  if (process.env.MODE === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.MODE === 'production') {
    // let error = { ...err };
    if (err.name === 'CastError') {
      err = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      err = handleDuplicateFieldsDB(err);
    }
    if (err.name === 'ValidationError') {
      err = handleValidationError(err);
    }

    sendErrorProd(err, res);
  }
};
