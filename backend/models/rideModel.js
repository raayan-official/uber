const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "captain",
  },
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  fare: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "onway", "completed", "cancelled"],
    default: "pending",
  },
  duration: { type: Number },
  distance: { type: Number },
  paymentId: { type: String },
  orderId: { type: String },
  signature: { type: String },
  otp: {
    type: String,
    selected: false,
    required: true,
  },
});

module.exports = mongoose.model("ride", rideSchema);