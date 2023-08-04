const { json } = require("express");
const fs = require("fs");

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/users.json`)
);

//function middleware validation
const checkID = (req, res, next, val) => {
  if (val > users.length)
    return res.status(400).json({
      status: "Fails",
      message: "Invalid id",
    });

  next();
};

const checkReqBody = (req, res, next) => {
  if (JSON.stringify(req.body) === "{}" || !req.body.name)
    return res.status(400).json({
      status: "Fails",
      message: "Missing data, fill all data and try again please",
    });
  next();
};
const checkUsers = (req, res, next) => {
  if (!users)
    return res.status(404).json({
      status: "Fails",
      message: "Users don't have data",
    });
  next();
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "Success",
    data: {
      users,
    },
  });
};
const getUser = (req, res) => {
  const id = +req.params.id;
  const user = users.find((el) => el.id === id);

  res.status(200).json({
    status: "Success",
    data: {
      user,
    },
  });
};
const createUser = (req, res) => {
  const id = +req.params.id;

  const user = Object.assign({ id }, req.body);

  users.push(user);
  fs.writeFile(
    `${__dirname}/../dev-data/user.json`,
    JSON.stringify(users),
    (err) => {
      if (err)
        return res.status(404).json({
          status: "Fails",
          message: "Can't create user",
        });

      res.status(201).json({
        status: "Success",
        data: {
          user,
        },
      });
    }
  );
};
const updateUser = (req, res) => {
  const id = +req.params.id;
  const userIndex = users.findIndex((el) => el.id === id);
  const userUpdate = Object.assign({ id }, req.body);

  users[userIndex] = userUpdate;
  fs.writeFile(
    `${__dirname}/../dev-data/user.json`,
    JSON.stringify(users),
    (err) => {
      if (err)
        return res.status(404).json({
          status: "Fails",
          message: "Can't create user",
        });

      res.status(200).json({
        status: "Success",
        data: {
          userUpdate,
        },
      });
    }
  );
};
const deleteUser = (req, res) => {
  const id = +req.params.id;
  const userIndex = users.findIndex((el) => el.id === id);

  users.splice(userIndex, 1);
  fs.writeFile(
    `${__dirname}/../dev-data/user.json`,
    JSON.stringify(users),
    (err) => {
      if (err)
        return res.status(404).json({
          status: "Fails",
          message: "Can't create user",
        });

      res.status(204).json({
        status: "Success",
        data: null,
      });
    }
  );
};

module.exports = {
  checkID,
  checkReqBody,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkUsers,
};
