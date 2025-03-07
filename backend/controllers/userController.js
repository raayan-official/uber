const userModel = require("../models/userModel");
const userService = require("../services/userService");
const { validationResult } = require("express-validator");
const blacklistedTokenModel = require("../models/blackListTokenModel");

module.exports.userRegister = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password } = req.body;
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
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
  const hashPassword = await userModel.hashPassword(password);
  const user = await userService.createUser({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password: hashPassword,
    role: "user",
  });
  const token = user.generateAuthToken();
  res.status(200).json({ user, token });
};

module.exports.userLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid Email And Password" });
  }
  const isValid = await user.comparePassword(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid Email And Password" });
  }
  const token = user.generateAuthToken();
  res.cookie("token", token);
  res.status(200).json({ user, token });
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

module.exports.userLogout = async (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  res.clearCookie("token");
  await blacklistedTokenModel.create({ token });
  res.status(200).json({ message: "Logout Successfully" });
};
