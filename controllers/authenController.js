const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// const { verify } = require('crypto');
const User = require('../models/userModel');
const catchasync = require('../utilis/catchAsync');
const AppError = require('../utilis/appError');
const Email = require('../utilis/sendMail');

const createToken = (user) =>
  jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createAndSendJWT = (user, statusCode, res) => {
  const token = createToken(user);

  const cookieOptions = {
    maxAge: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    domain: 'localhost',
    path: '/',
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
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
  // const url = 'http://localhost:3000/profile';
  const url = `${req.protocol}://${req.get('host')}/profile`;
  console.log(url);
  await new Email(newUser,url).sendWelcome();

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

exports.logout = (req, res) => {
  const cookieOptions = {
    maxAge: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    domain: 'localhost',
    path: '/',
  };
  res.cookie('jwt', 'logded out', cookieOptions);
  res.status(200).json({ status: 'success' });
};

exports.stricted = catchasync(async (req, res, next) => {
  //get token from header
  let token = ' ';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  res.locals.user = currentUser;
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
    const resetToken = user.createResetToken();
    await user.save({ validateBeforeSave: false });
  
    try {
      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/user/resetPassword/${resetToken}`;
  
      await new Email(user, resetURL).sendResetPassword();
  
      res.status(200).json({
        status: 'success',
        message: 'Email sent',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
  
      return next(new AppError('Error occurred, try again', 500));
    }
  });
  
exports.resetPassword = catchasync(async (req, res, next) => {
   // 1) Get user based on the token
   const hashedToken =  crypto
   .createHash('sha256')
   .update(req.params.token)
   .digest('hex');

 const user = await User.findOne({
   passwordResetToken: hashedToken,
   passwordResetExpires: { $gt: Date.now() }
 });

 // 2) If token has not expired, and there is user, set the new password
 if (!user) {
   return next(new AppError('Token is invalid or has expired', 400));
 }
 user.password = req.body.password;
 user.passwordConfirm = req.body.passwordConfirm;
 user.passwordResetToken = undefined;
 user.passwordResetExpires = undefined;
 await user.save();

 // 3) Update changedPasswordAt property for the user
 // 4) Log the user in, send JWT
 createAndSendJWT(user, 200, res);

console.log({hashedToken},req.params.token);
});

exports.updatePassword = catchasync(async (req, res, next) => {
  //1 get user from collection
  const user = await User.findById(req.user._id).select('+password');

  //2 check if the POSTed password is correct
  if (!(await user.comparePassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your password is incorrect', 401));
  }

  //3 update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); //turn off validation
  //4 send token
  createAndSendJWT(user, 200, res);
  res.send(user);
});


// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changePasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      req.user = currentUser;
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
