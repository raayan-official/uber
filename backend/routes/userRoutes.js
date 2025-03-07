const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First Name Must Be 3 Characters Long"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password Must Be 8 Characters Long"),
  ],
  userController.userRegister
);

router.post("/login", [
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password Must Be 8 Characters Long"),
  userController.userLogin,
]);

router.get("/profile", authMiddleware.authUser, userController.getUserProfile);

router.get("/logout", authMiddleware.authUser, userController.userLogout);

module.exports = router;
