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
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
userSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || !this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
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
