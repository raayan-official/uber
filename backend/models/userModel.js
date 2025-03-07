const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      require: true,
      minlength: [3, "First name must be 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be 3 characters long"],
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    minlength: [5, "Email must be 5 characters long"],
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  socketId: {
    type: String,
  },
  role: { type: String, enum: ["user"], default: "user" },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model("user", userSchema);
