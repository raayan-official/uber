const rideModel = require("../models/rideModel");
const mapService = require("./mapService");
const crypto = require("crypto");
const {sendMessageToSocket} = require("../socket");

async function getFare(pickup, dropoff) {
  if (!pickup || !dropoff) {
    throw new Error("Invalid pickup or dropoff location.");
  }

  try {
    const distanceTime = await mapService.getDistanceTime(pickup, dropoff);
    if (!distanceTime?.distance || !distanceTime?.duration) {
      throw new Error("Invalid distance or time data from API.");
    }

    const distanceInKm = parseFloat(distanceTime.distance.replace(" km", ""));
    
    const durationParts = distanceTime.duration.match(/\d+/g) || [];
    const durationInMinutes = durationParts.reduce((acc, val, index) => {
      return acc + parseInt(val) * (index === 0 && distanceTime.duration.includes("hour") ? 60 : 1);
    }, 0);

    const baseFare = { car: 50, moto: 30, auto: 20 };
    const perKmRate = { car: 15, moto: 8, auto: 13 };
    const perMinuteRate = { car: 3, moto: 2, auto: 1.5 };

    return {
      car: Math.round(baseFare.car + distanceInKm * perKmRate.car + durationInMinutes * perMinuteRate.car),
      moto: Math.round(baseFare.moto + distanceInKm * perKmRate.moto + durationInMinutes * perMinuteRate.moto),
      auto: Math.round(baseFare.auto + distanceInKm * perKmRate.auto + durationInMinutes * perMinuteRate.auto),
    };
  } catch (error) {
    console.error("🚨 Error calculating fare:", error.message);
    throw new Error("Failed to calculate fare. Please try again.");
  }
}

function getOtp(num) {
  return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

async function createRide({ user, pickup, dropoff, vehicleType }) {
  if (!user || !pickup || !dropoff || !vehicleType) {
    throw new Error("Invalid input: user, pickup, dropoff, and vehicleType are required.");
  }

  try {
    const fare = await getFare(pickup, dropoff);
    if (!fare[vehicleType]) {
      throw new Error("Invalid vehicle type.");
    }

    const ride = await rideModel.create({
      user,
      pickup,
      dropoff,
      otp: getOtp(6),
      vehicleType,
      fare: fare[vehicleType],
    });

    return ride;
  } catch (error) {
    console.error("🚨 Error creating ride:", error.message);
    throw new Error("Failed to create ride. Please try again.");
  }
}

async function confirmRide(rideId, captainId) {
  if (!rideId || !captainId) {
    throw new Error("Invalid input: rideId and captainId are required.");
  }

  try {
    const updatedRide = await rideModel.findOneAndUpdate(
      { _id: rideId, status: { $ne: "accepted" } },
      { status: "accepted", captain: captainId },
      { new: true }
    );

    if (!updatedRide) {
      console.warn("🚨 Ride not found or already accepted.");
      return null;
    }

    return await rideModel.findOne({ _id: rideId }).populate("user").populate("captain");
  } catch (error) {
    console.error("🚨 Error confirming ride:", error.message);
    return null;
  }
};

const startRide = async ({ rideId, otp, captain }) => {
 
  if (!otp) {
      throw new Error("OTP is required");
  }

  const updatedRide = await rideModel.findOneAndUpdate(
      { _id: rideId, status: "accepted", otp: otp },
      { status: "ongoing" },
      { new: true }
  ).populate("user").populate("captain").select("+otp");

  if (!updatedRide) {
      throw new Error("Invalid ride details or incorrect OTP");
  }

  // Send WebSocket event after successfully updating the ride status
  if (updatedRide.user?.socketId) {
      sendMessageToSocket(updatedRide.user.socketId, {
          event: "ride-started",
          data: updatedRide,
      });
  } else {
      console.warn("User socketId not found, skipping socket message");
  }

  return updatedRide;
};

const endRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride ID is required");
  }

  // Find the ride with captain validation
  const ride = await rideModel
    .findOne({ _id: rideId, captain: captain._id })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  // ✅ Update the ride status and return the updated ride
  const updatedRide = await rideModel
    .findOneAndUpdate(
      { _id: rideId },
      { status: "completed" },
      { new: true } // Return updated ride
    )
    .populate("user")
    .populate("captain");

  if (!updatedRide) {
    throw new Error("Failed to update ride status");
  }

  return updatedRide;
};


module.exports = {
  getFare,
  getOtp,
  createRide,
  confirmRide,
  startRide,
  endRide
};
