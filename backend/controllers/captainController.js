const blacklistedTokenModel = require("../models/blackListTokenModel");
const { validationResult } = require("express-validator");
const captainService = require("../services/captainService");
const captainModel = require("../models/captainModel");

module.exports.captainSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, vehicle} = req.body;

  const existingCaptain = await captainModel.findOne({email});
  if (existingCaptain) {
    return res.status(400).json({ error: "Email already exists" });
  };
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        error:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
  }
  const hashPassword = await captainModel.hashPassword(password);
  const captain = await captainService.createCaptain({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password: hashPassword,
    role: "captain",
    vehicle: {
      vehicleColor: vehicle.vehicleColor,
      vehicleType: vehicle.vehicleType,
      vehicleModel: vehicle.vehicleModel,
      vehicleBrand: vehicle.vehicleBrand,
      vehicleYear: vehicle.vehicleYear,
      vehiclePlate: vehicle.vehiclePlate,
      vehicleCapacity: vehicle.vehicleCapacity,
      vehicleStatus: vehicle.vehicleStatus,
    },
    
  });
  const token = captain.generateAuthToken();
  res.status(200).json({ captain, token });
};

module.exports.captainLogin = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(401).json({ message: "Invalid Email And Password" });
    }
    const isValid = await captain.comparePassword(password, captain.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid Email And Password" });
    }
    const token = captain.generateAuthToken();
    res.cookie("token", token);
    res.status(200).json({ captain, token });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

module.exports.captainLogout = async (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  res.clearCookie("token");
  await blacklistedTokenModel.create({ token });
  res.status(200).json({ message: "Logout Successfully" });
};

