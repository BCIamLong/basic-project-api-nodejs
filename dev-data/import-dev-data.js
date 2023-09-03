const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Post = require('../models/postModel');
const User = require('../models/userModel');

dotenv.config({ path: './config.env' });

const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connect successful'))
  .catch(err => console.log(err));

const importData = async (model, data) => {
  try {
    await model.insertMany(data);
    console.log('Import data success');
  } catch (err) {
    console.log(err);
  }
  // mongoose.connection.close();
  //!! process.exit() is the way not good to stop process but in this case we only interact with DB and some files so it's not problem but in project we shouldn't use this
  process.exit();
};

const deleteAllData = async model => {
  try {
    await model.deleteMany();
    console.log('Delete all data success');
  } catch (err) {
    console.log(err);
  }
  // mongoose.connection.close();
  process.exit();
};

// console.log(process.argv);
// importData(posts);
// deleteAllData();
if (process.argv[2] === '--import-posts') importData(Post, posts);
if (process.argv[2] === '--delete-posts') deleteAllData(Post);
if (process.argv[2] === '--import-users') importData(User, users);
if (process.argv[2] === '--delete-users') deleteAllData(User);
