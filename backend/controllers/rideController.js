const rideService = require("../services/rideService");
const { validationResult } = require("express-validator");
const mapService = require("../services/mapService");
const { sendMessageToSocket } = require("../socket");
const rideModel = require("../models/rideModel");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, error: "Unauthorized: User not found." });
    }

    const { pickup, dropoff, vehicleType } = req.body;
    if (!pickup || !dropoff || !vehicleType) {
      return res.status(400).json({ success: false, error: "All fields pickup, dropoff, vehicleType are required." });
    }

    const ride = await rideService.createRide({ user: req.user._id, pickup, dropoff, vehicleType });
    if (!ride) {
      throw new Error("Ride creation failed");
    }

    const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
   

    const captainsInTheRadius = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.latitude, pickupCoordinates.longitude, 2
    );

   

    const rideWithUser = await rideModel.findById(ride._id).populate("user");
    if (!rideWithUser) {
      throw new Error("Ride with user details not found");
    }

    captainsInTheRadius.forEach((captain) => {
      try {
        sendMessageToSocket(captain.socketId, { event: "new-ride", data: rideWithUser });
      } catch (socketError) {
        console.error("❌ Error sending socket message to captain:", socketError);
      }
    });

    res.status(201).json({ success: true, ride });
  } catch (error) {
    console.error("❌ Error creating ride:", error);
    return res.status(500).json({ success: false, error: "Failed to create ride. Please try again later." });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { pickup, dropoff } = req.query;
    if (!pickup || !dropoff) {
      return res.status(400).json({ success: false, error: "Pickup and dropoff are required." });
    }

    const fare = await rideService.getFare(pickup, dropoff);
    return res.status(200).json({ success: true, fare });

  } catch (error) {
    console.error("❌ Error getting fare:", error);
    return res.status(500).json({ success: false, error: "Failed to get fare. Please try again later." });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({ success: false, error: "Ride ID is required." });
    }

    if (!req.captain || !req.captain._id) {
      console.error("❌ Error: Captain is not defined in request.");
      return res.status(401).json({ success: false, error: "Unauthorized access." });
    }

    const ride = await rideService.confirmRide(rideId, req.captain._id);
    if (!ride) {
      console.error("❌ Error: Ride not found or failed to update.");
      return res.status(400).json({ success: false, error: "Failed to confirm ride." });
    }

    if (ride.user && ride.user.socketId) {
      sendMessageToSocket(ride.user.socketId, { event: "ride-confirmed", data: ride });
    } else {
      console.warn("⚠️ Warning: Ride user socket ID is missing. Socket event not sent.");
    }

    return res.status(200).json({ success: true, ride });

  } catch (error) {
    console.error("❌ Error confirming ride:", error.message);
    return res.status(500).json({ success: false, error: "Failed to confirm ride. Please try again later." });
  }
};



module.exports.startRide = async (req, res) => {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract and validate query parameters
    const { rideId, otp } = req.query;
    if (!rideId || !otp) {
      return res.status(400).json({ message: "rideId and otp are required" });
    }

    // Ensure captain is authenticated
    if (!req.captain) {
      return res.status(401).json({ message: "Unauthorized access: Captain details missing" });
    }

    // Start the ride
    const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found or unable to start" });
    }

    // Send real-time event to the user
    if (ride.user?.socketId) {
      sendMessageToSocket(ride.user.socketId, {
        event: "ride-started",
        data: ride,
      });
    } else {
      console.warn("User socketId not found, skipping socket message");
    }

    return res.status(200).json({ message: "Ride started successfully", ride });

  } catch (error) {
    console.error("Error in startRide:", error);

    // Check for expected errors and respond accordingly
    if (error.message === "Invalid OTP") {
      return res.status(400).json({ message: "Incorrect OTP. Please try again." });
    } else if (error.message === "Ride not found") {
      return res.status(404).json({ message: "Ride not found" });
    }

    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports.endRide = async (req, res) => {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  // Validate captain existence
  if (!req.captain) {
    return res.status(403).json({ message: "Unauthorized access: Captain details missing" });
  }

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    // Handle case where ride is not found
    if (!ride) {
      return res.status(404).json({ message: "Ride not found or already ended" });
    }

    // Ensure user has a socketId before sending event
    if (ride.user?.socketId) {
      sendMessageToSocket(ride.user.socketId, {
        event: "ride-ended",
        data: ride,
      });
    } else {
      console.warn("User socketId not found, skipping socket message");
    }

    return res.status(200).json(ride);
  } catch (err) {
    console.error("Error in endRide:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};