const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title not empty"],
  },
  body: {
    type: String,
  },
  author: {
    type: String,
    unique: true,
  },
});

const Post = new mongoose.model("Post", postSchema);

module.exports = Post;
