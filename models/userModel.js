const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const AppError = require('../utils/appError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please fill your name'],
      trim: true,
      // minLength: 10,
      maxLength: 30,
    },
    username: {
      type: String,
      required: [true, 'Please fill your username'],
      unique: true,
      trim: true,
      // minLength: 1,
      maxLength: 30,
    },
    email: {
      type: String,
      required: [true, 'Please fill your email'],
      unique: true,
      validate: [validator.isEmail, 'Email must to email type'],
      select: false,
      //* you can also use regex to validate data
      // match:
      //   /^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|.(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please fill your password'],
      minLength: [8, 'Password musth have 8 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      minLength: [8, 'Password musth have 8 characters'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Confirm password not correct, please check and try again',
      },
    },
    address: {
      street: String,
      suite: String,
      city: String,
      zipcode: String,
      geo: {
        lat: String,
        lng: String,
      },
    },
    phone: {
      type: String,
      required: [true, 'User must have a phone number'],
      unique: true,
      validate: [
        validator.isMobilePhone,
        'Phone number invalid, please check and try again',
      ],
      trim: true,
      select: false,
    },
    photo: {
      type: String,
      default: 'default_user_photo.jpg',
    },
    website: {
      type: String,
      trim: true,
    },
    company: {
      name: String,
      catchPhrase: String,
      bs: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenTimeout: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    reasonDeleleAccount: String,
    joinedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    // toJSON: { virtuals: true },
  },
);

userSchema.methods.checkPassword = async function (currentPwd, hashPwd) {
  return await bcrypt.compare(currentPwd, hashPwd);
};

userSchema.methods.checkPasswordChangeAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt)
    return Math.floor(Date.parse(this.passwordChangedAt / 1000)) > JWTTimeStamp;

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(48).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenTimeout = Date.now() + 12 * 60 * 1000;
  return resetToken;
};

userSchema.pre('save', async function (next) {
  // if you change the password => that time we hashing password
  if (!this.isModified('password')) return next();
  // if (!(this.password === this.passwordConfirm))
  //   return next(
  //     new AppError('Confirm password not correct, please check and try again')
  //   );

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  if (this.isNew) return next();
  if (this.passwordResetTokenTimeout < Date.now())
    return next(new AppError('Your password reset token was expired', 401));
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }).select('-__v');
  next();
});

userSchema.virtual('compannyInfo').get(function () {
  return [this.company.name, this.company.bs];
});

const User = mongoose.model('User', userSchema);

module.exports = User;
