const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name not empty'],
      trim: true,
      minLength: 10,
      maxLength: 30,
    },
    username: {
      type: String,
      required: [true, 'User not empty'],
      unique: true,
      trim: true,
      minLength: 10,
      maxLength: 30,
    },
    email: {
      type: String,
      required: [true, 'User must have an email'],
      unique: true,
      validate: [validator.isEmail, 'Email must to email type'],
      //* you can also use regex to validate data
      // match:
      //   /^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|.(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/,
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
      maxLength: 11,
      trim: true,
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
  },
  {
    toJSON: { virtuals: true },
  }
);

userSchema.virtual('compannyInfo').get(function () {
  return [this.company.name, this.company.bs];
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
