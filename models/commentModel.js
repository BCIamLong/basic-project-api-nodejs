const mongoose = require('mongoose');
const Post = require('./postModel');

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

//* set compound index for post and user for create new comments, when create comment we need query to author and post right so it'll lost more time to go though all author(user id) and post(post id) and this action always occurs everytime and some features also use query with author and post like checkLimitedUserComment,...

commentSchema.index({ author: 1, post: 1 });

commentSchema.pre(/^find/, function (next) {
  this.populate({ path: 'author', select: 'name username photo' });
  next();
});

commentSchema.statics.calcCommentQuantity = async function (postId) {
  const stats = await this.aggregate([
    {
      $match: { post: postId },
    },
    {
      $group: {
        _id: '$post',
        nComment: { $sum: 1 },
      },
    },
  ]);

  await Post.findByIdAndUpdate(postId, {
    commentQuantity: stats[0]?.nComment || 0,
  });
};

commentSchema.post('save', async function (doc, next) {
  await this.constructor.calcCommentQuantity(this.post);
  next();
});

commentSchema.post(/^findOneAnd/, async (doc, next) => {
  await doc.constructor.calcCommentQuantity(doc.post);
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
