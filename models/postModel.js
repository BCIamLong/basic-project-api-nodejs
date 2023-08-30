const mongoose = require('mongoose');
// const validator = require('validator');

const postSchema = new mongoose.Schema(
  {
    // *https://mongoosejs.com/docs/schematypes.html#schematype-options read for schema type
    title: {
      type: String,
      required: [true, 'A post mush have a title'],
      trim: true,
      maxLength: 300,
      minLength: 10,
    },
    content: {
      type: String,
      required: [true, 'A post must have a content'],
      trim: true,
      minLength: 10,
    },
    image: {
      type: String,
      required: [true, 'Post must have an image'],
    },
    images: [String],
    likes: {
      type: Number,
      default: 0,
      validate: {
        validator: function (val) {
          return val >= 0;
          //  && val <= this.viewers;
        },
        message: 'Likes must to positive number and less than viewers',
      },
    },
    comment: {
      type: String,
      default: '',
      trim: true,
    },
    shares: {
      type: Number,
      default: 0,
      validate: {
        validator: function (val) {
          return val >= 0;
          // && val <= this.viewers;
        },
        message: 'Shares must to the positive number and less than viewers',
      },
    },
    viewers: {
      type: Number,
      default: 0,
      validate: {
        validator: function (val) {
          return val >= 0;
          //this.likes;
          // && val >= this.shares;
        },
        message: 'Viewers must to greater than equals likes and shares',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
      // validate: {
      //   validator: function (val) {
      //     return val >= Date.now();
      //   },
      //   message: 'Date must to greater than equal the current time',
      // },
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    //*why we need it for virtual:https://mongoosejs.com/docs/tutorials/virtuals.html#virtuals-in-json
    toJSON: { virtuals: true },
    // toObject: true,
  },
);
//DOCs middleware: use save, remove, update
postSchema.pre('save', function (next) {
  //you can check data needed get from DB, check username exits? phone exits?...this is validation
  //some reason you fogot add field you can do it(maybe not use in real)
  this.viewers = (this.likes + this.shares) * 10;
  // console.log(this);

  next();
});

// postSchema.post('save', function (docs, next) {
//   console.log('Add data success');
//   // console.log(docs);
//   next();
// });

//Query middleware
postSchema.pre(/^find/, function (next) {
  //do some thing before we really run query in await
  //! all thing you do in this effect to query method as: findByIdAndUpdate, find,....
  // console.log('This is query middleware');

  // this.limit(3); limit() dont use for find and update so it'll error notice when we manipulate more events in the same middleware
  this.spopulate({ path: 'author', select: 'name username photo' }).populate(
    'comments',
  );
  next();
});

// postSchema.post(/^find/, function (docs, next) {
//   // console.log(docs);
//   next();
// });

//* https://mongoosejs.com/docs/middleware.html#aggregate
postSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { likes: { $gte: 10 } },
  });
  next();
});

// postSchema.post('aggregate', function (docs, next) {
//   console.log(docs);
//   console.log('Aggregation pipeline success');
//   next();
// });

//create interact virtual property
postSchema.virtual('interact').get(function () {
  return (this.likes + this.shares) / 2;
});

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
