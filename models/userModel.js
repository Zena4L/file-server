const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AppError = require('../utilis/appError');

const userSchema = new mongoose.Schema({
  //name,email,password,passwordconfirm
  name: {
    type: String,
    required: [true, 'User require a name'],
  },
  email: {
    type: String,
    required: [true, 'User must have enail'],
    validate: [validator.isEmail, 'User must have email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: [8, 'Password must be a minimum of 8'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: [8, 'Password must be a minimum of 8'],
    validat: {
      validator: function (el) {
        return el === this.password;
      },
    },
    message: 'Passowrds do not match',
  },
  passwordChangeAt: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//query middleware
userSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 100,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};
userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 100;
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
