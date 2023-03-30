const catchAsync = require('../utilis/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utilis/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'ok',
    data: {
      users,
    },
  });
});


