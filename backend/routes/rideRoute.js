const express = require("express");
const router = express.Router();
const {body, query} = require("express-validator");
const rideController = require("../controllers/rideController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create",
   authMiddleware.authUser,
    body('pickup').isString().withMessage("Invalid Pickup Location"),
    body('dropoff').isString().withMessage("Invalid Dropoff Location"),
    body('vehicleType').isString().isIn(['car', 'moto', 'auto']).withMessage("Invalid Vehicle Type"),
    rideController.createRide
 );

 router.get("/getfare", authMiddleware.authUser, 
   query('pickup').isString().isLength({min: 3}).withMessage("Invalid Pickup Location"),
   query('dropoff').isString().isLength({min: 3}).withMessage("Invalid Dropoff Location"),
    rideController.getFare);

router.post("/confirm", authMiddleware.authCaptain, body('rideId').isMongoId().withMessage("Invalid Ride ID"), 
rideController.confirmRide);

router.get("/start-ride", authMiddleware.authCaptain, query('rideId').isMongoId().withMessage('Invalid Ride Id'),
query('otp').isString().isLength({min: 6, max: 6}).withMessage("Invalid Otp"),
rideController.startRide
);

router.post("/end-ride", authMiddleware.authCaptain, body('rideId').isMongoId().withMessage('Invalid Ride Id'), rideController.endRide);

module.exports = router;