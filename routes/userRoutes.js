const express = require("express");
const {
  checkID,
  checkReqBody,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkUsers,
} = require("./../controllers/userController");
const router = express.Router();

router.param("id", checkID);

router.route("/").get(checkUsers, getAllUsers).post(checkReqBody, createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
