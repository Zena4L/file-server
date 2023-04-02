const catchAsync = require('../utilis/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utilis/appError');

// filtering so that user can only update name and email

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'ok',
    length: users.length,
    data: {
      users,
    },
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  // throw error if user tries to change password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You cannot performt this action here', 402));
  }

  const postedObj = filterObj(req.body, 'name', 'email');
  const updateUser = await User.findByIdAndUpdate(req.user.id, postedObj, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'ok',
    data: {
      user: updateUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
