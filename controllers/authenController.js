const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { verify } = require('crypto');
const User = require('../models/userModel');
const catchasync = require('../utilis/catchAsync');
const AppError = require('../utilis/appError');

const createToken = (user) =>
  jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// return res.status(200).json({
//   status: 'ok',
//   token,
//   data: {
//     user,
//   },
// });
exports.signup = catchasync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = createToken(newUser);

  res.status(200).json({
    status: 'ok',
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchasync(async (req, res, next) => {
  //1. get user email and password
  //2.  check if email and password exits
  //3. check if password is correct
  //4. send token
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Enter email or password', 401));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Email or password incorrect!', 401));
  }
  const token = createToken(user);

  res.status(200).json({
    status: 'ok',
    token,
  });
});

exports.protected = catchasync(async (req, res, next) => {
  //get token from header
  let token = ' ';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // verify token
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
  //get user
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('User does not exit', 401));
  }
  // check if user changed password after token issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    next(new AppError('User recently changed password', 401));
  }

  req.user = currentUser
  next();
});
