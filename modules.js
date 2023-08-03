const fs = require("fs");
const posts = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data.json`));

const getAllPosts = (req, res) => {
  if (!posts)
    res.status(404).json({
      status: "Faild",
      message: "Not posts exits",
    });
  res.status(200).json({
    status: "Success",
    data: {
      posts,
    },
  });
};

const createPost = (req, res) => {
  const newId = posts[posts.length - 1].id + 1;

  const newPost = Object.assign({ newId }, req.body);
  posts.push(newPost);

  fs.writeFile(
    `${__dirname}/dev-data/data.json`,
    JSON.stringify(posts),
    (err) => {
      if (err)
        res.status(404).json({
          status: "Faild",
          message: "can't create post",
        });
      res.status(201).json({
        status: "Success",
        data: {
          post: newPost,
        },
      });
    }
  );
};
const getPost = (req, res) => {
  const id = +req.params.id;
  const post = posts.find((el) => el.id === id);
  if (!post)
    res.status(404).json({
      status: "Faild",
      message: "Post not found",
    });
  res.status(200).json({
    status: "Success",
    data: {
      post,
    },
  });
};

const updatePieceOfPost = (req, res) => {
  const id = +req.params.id;
  const pieceUpdate = req.body;
  const postUpdate = posts.find((el) => el.id === id);
  const indexUpdate = posts.findIndex((el) => el.id === id);
  Object.assign(postUpdate, pieceUpdate);

  posts[indexUpdate] = postUpdate;
  fs.writeFile(
    `${__dirname}/dev-data/data.json`,
    JSON.stringify(posts),
    (err) => {
      if (err)
        res.status(404).json({
          status: "Faild",
          message: "can't update post",
        });
      res.status(200).json({
        status: "Success",
        data: {
          post: postUpdate,
        },
      });
    }
  );
};

const updatePost = (req, res) => {
  const id = +req.params.id;
  const postUpdate = req.body;
  const indexUpdate = posts.findIndex((el) => el.id === id);
  const post = Object.assign({ id }, postUpdate);
  posts[indexUpdate] = post;

  fs.writeFile(
    `${__dirname}/dev-data/data.json`,
    JSON.stringify(posts),
    (err) => {
      if (err)
        res.status(404).json({
          status: "Faild",
          message: "can't update post",
        });
      res.status(200).json({
        status: "Success",
        data: {
          post: post,
        },
      });
    }
  );
};

const deletePost = (req, res) => {
  const id = +req.params.id;
  const index = posts.findIndex((el) => el.id === id);

  posts.splice(index, 1);
  fs.writeFile(
    `${__dirname}/dev-data/data.json`,
    JSON.stringify(posts),
    (err) => {
      if (err)
        res.status(404).json({
          status: "Faild",
          message: "can't delete post",
        });
      res.status(204).json({
        status: "Success",
        data: null,
      });
    }
  );
};

module.exports = {
  getAllPosts,
  createPost,
  getPost,
  updatePieceOfPost,
  updatePost,
  deletePost,
};
