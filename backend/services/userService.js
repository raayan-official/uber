const userModel = require("../models/userModel");

module.exports.createUser = async ({ fullname, email, password }) => {
  const { firstname, lastname } = fullname;
  if (!firstname || !email || !password) {
    throw new Error("All Fields Are Required");
  }
  const user = await userModel.create({
    fullname: {
        firstname,
        lastname,
      },
    email,
    password,
  });
  return user;
};


