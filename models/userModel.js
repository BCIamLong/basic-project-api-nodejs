const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name not empty"],
  },
  userName: {
    type: String,
    required: [true, "User not empty"],
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: Number,
    unique: true,
  },
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
