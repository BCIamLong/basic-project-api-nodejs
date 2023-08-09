const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A post mush have a title'],
  },
  content: {
    type: String,
    required: [true, 'A post must have a content'],
  },
  author: {
    type: String,
    // unique: true,
  },
  image: {
    type: String,
    required: [true, 'Post must have an image'],
  },
  images: [String],
  likes: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
    default: '',
  },
  shares: {
    type: Number,
    default: 0,
  },
});

const Post = new mongoose.model('Post', postSchema);

module.exports = Post;
