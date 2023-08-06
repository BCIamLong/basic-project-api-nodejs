const Post = require("../models/postModel");

const getAllPosts = async (_, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      status: "Success",
      data: {
        posts,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fails",
      message: "posts data not found",
      error: err,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);

    res.status(201).json({
      status: "Success",
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fails",
      message: "Data invalid",
      error: err,
    });
  }
};
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json({
      status: "Success",
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fails",
      message: "post data not found",
      error: err,
    });
  }
};

const checkReqBodyStringType = (req, res, next) => {
  if (req.body.title && typeof req.body.title !== "string")
    return res.status(400).json({
      status: "Fails",
      message: "Data invalid",
    });
  if (req.body.body && typeof req.body.body !== "string")
    return res.status(400).json({
      status: "Fails",
      message: "Data invalid",
    });
  if (req.body.author && typeof req.body.author !== "string")
    return res.status(400).json({
      status: "Fails",
      message: "Data invalid",
    });

  next();
};
const updatePieceOfPost = async (req, res) => {
  try {
    console.log(typeof req.body.name);
    //The schema validate doesn't check type for String in this case i set name = 1(number) but it's still pass so to do it you need create middleware to check for this
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).json({
      status: "Success",
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fails",
      message: "Data invalid",
      error: err,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    console.log(typeof req.body.name);
    //The schema validate doesn't check type for String in this case i set name = 1(number) but it's still pass so to do it you need create middleware to check for this
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).json({
      status: "Success",
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fails",
      message: "Data invalid",
      error: err,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fails",
      message: "Invalid id",
      error: err,
    });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPost,
  updatePieceOfPost,
  updatePost,
  deletePost,
  checkReqBodyStringType,
};
