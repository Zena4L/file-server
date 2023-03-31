const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { verify } = require('crypto');
const User = require('../models/userModel');
const catchasync = require('../utilis/catchAsync');
const AppError = require('../utilis/appError');
const sendEmail = require('../utilis/sendMail');

const createToken = (user) =>
  jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createAndSendJWT = (user, statusCode, res) => {
  const token = createToken(user);

  res.status(statusCode).json({
    status: 'ok',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchasync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createAndSendJWT(newUser, 200, res);
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

  createAndSendJWT(user, 200, res);
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

  req.user = currentUser;
  next();
});
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 402));
    }
    next();
  };
exports.forgotPassword = catchasync(async (req, res, next) => {
  // get email from user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User not found', 402));
  }
  // create reset token
  const resetToken = await user.createResetToken();
  await user.save({ validateBeforeSave: false });
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/resetPassword/${resetToken}`;
    const message = `submit a patch request to ${resetURL}, Ignore if you did not perform this action`;

    await sendEmail({
      email: user.email,
      subject: 'Your Reset Token, valid for 10mins',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Email send',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExipres = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Error occured,try again', 500));
  }
});
exports.resetPassword = catchasync(async (req, res, next) => {
  // get user based on posted token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('User do not exit or token has expired'));
  }
  // update passwordChangedAt property on schema
  // set new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  await user.save();
  // send jwt

  createAndSendJWT(user, 200, res);
});
exports.updatePassword = catchasync(async (req, res, next) => {
  //1 get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //2 check if the POSTed password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your password is incorrect', 401));
  }

  //3 update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); //turn off validation

  //4 send token

  createAndSendJWT(user, 200, res);
});
