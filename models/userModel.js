const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name not empty'],
  },
  username: {
    type: String,
    required: [true, 'User not empty'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
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
  },
  website: {
    type: String,
  },
  company: {
    name: String,
    catchPhrase: String,
    bs: String,
  },
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
