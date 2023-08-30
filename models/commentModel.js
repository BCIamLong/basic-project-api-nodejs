const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please enter your comment'],
  },
  likes: {
    type: Number,
    default: 0,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A comment must belong an author'],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'A comment must belong a post'],
  },
});

commentSchema.pre(/^find/, function (next) {
  this.populate({ path: 'author', select: 'name username photo' });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
