const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be 5 characters long"],
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
  isOnline: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
  role: { type: String, enum: ["captain"], default: "captain" },
  vehicle: {
    vehicleColor: {
      type: String,
      required: true,
      minlength: [3, "Color must be 3 characters long"],
    },
    vehiclePlate: {
      type: String,
      required: true,
      minlength: [3, "Plate must be 3 characters long"],
    },
    vehicleCapacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"],
    },
    vehicleType: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["car", "moto", "auto"],
    },
    vehicleModel: {
      type: String,
      required: true,
      minlength: [3, "Model must be 3 characters long"],
    },
    vehicleBrand: {
      type: String,
      required: true,
      minlength: [3, "Brand must be 3 characters long"],
    },
    vehicleYear: {
      type: Number,
      required: true,
      min: [1900, "Year must be at least 1900"],
    },
    vehicleStatus: {
      type: String,
      required: true,
      enum: ["available", "unavailable"],
      default: "unavailable",
    }
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
  },
});


captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id , role: this.role}, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const captionModel = mongoose.model("captain", captainSchema);
module.exports = captionModel;