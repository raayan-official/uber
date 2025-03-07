const userModel = require("../models/userModel");
const captainModel = require("../models/captainModel");
const jwt = require("jsonwebtoken");
const blacklistedTokenModel = require("../models/blackListTokenModel");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const isTokenBlacklisted = await blacklistedTokenModel.findOne({ token: token });
  if (isTokenBlacklisted) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Forbidden: User Access Only" });
    }
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const isTokenBlacklisted = await blacklistedTokenModel.findOne({ token: token });
  if (isTokenBlacklisted) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "captain") {
      return res.status(403).json({ message: "Forbidden: Captain Access Only" });
    }

    const captain = await captainModel.findById(decoded._id);
    if (!captain) {
      return res.status(401).json({ message: "Captain Not Found" });
    }
    req.captain = captain;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session Expired. Please log in again." });
  }
    return res.status(401).json({ message: "Invalid Token" });
  }
};
