const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    return JWTTimestamp < changePasswordAfter
  }
  return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
