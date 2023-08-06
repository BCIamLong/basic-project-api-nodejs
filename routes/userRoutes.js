const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkReqBodyStringType,
} = require("./../controllers/userController");
const router = express.Router();

// router.param("id", checkID);

router.route("/").get(getAllUsers).post(createUser);
router
  .route("/:id")
  .get(getUser)
  .patch(checkReqBodyStringType, updateUser)
  .delete(deleteUser);

module.exports = router;
