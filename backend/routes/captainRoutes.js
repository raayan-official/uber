const captainController = require("../controllers/captainController");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First Name Must Be 3 Characters Long"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password Must Be 8 Characters Long"),
    body("vehicle.vehicleColor")
      .isLength({ min: 3 })
      .withMessage("Color Must Be 3 Characters Long"),
    body("vehicle.vehiclePlate")
      .isLength({ min: 3 })
      .withMessage("Plate Must Be 3 Characters Long"),
    body("vehicle.vehicleCapacity")
      .isLength({ min: 1 })
      .withMessage("Capacity Must Be At Least 1"),
    body("vehicle.vehicleType")
      .isIn(["car", "moto", "auto"])
      .withMessage("Type Must Be Car Motorcycle Or Autorickshaw"),
    body("vehicle.vehicleModel")
      .isLength({ min: 3 })
      .withMessage("Model Must Be 3 Characters Long"),
    body("vehicle.vehicleBrand")
      .isLength({ min: 3 })
      .withMessage("Brand Must Be 3 Characters Long"),
    body("vehicle.vehicleYear")
      .isLength({ min: 4 })
      .withMessage("Year Must Be 4 Characters Long"),
      body("vehicle.vehicleStatus")
      .isIn(["available", "unavailable"])
      .withMessage("Status Must Be Available Or Unavailable"),
      
    
  ],
  captainController.captainSignup
);

router.post("/login", [
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password Must Be 8 Characters Long"),
  captainController.captainLogin,
]);

router.get("/profile", authMiddleware.authCaptain, captainController.getCaptainProfile);

router.get("/logout", authMiddleware.authCaptain, captainController.captainLogout);


module.exports = router;
