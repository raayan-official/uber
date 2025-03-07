const captainModel = require("../models/captainModel");

module.exports.createCaptain = async ({ fullname, email, password, vehicle}) => {
 

  const { firstname, lastname } = fullname;
  const {
    vehicleColor,
    vehiclePlate,
    vehicleCapacity,
    vehicleType,
    vehicleModel,
    vehicleBrand,
    vehicleYear,
    vehicleNumber,
    vehicleStatus,
  } = vehicle;

  if (
    !firstname  || !email || !password ||
    !vehicleColor || !vehiclePlate || !vehicleCapacity ||
    !vehicleType || !vehicleModel || !vehicleBrand ||
    !vehicleYear || !vehicleStatus
  ) {
    throw new Error("All fields are required");
  }
  


  const captain = await captainModel.create({
    fullname: { firstname, lastname }, // Correctly assign fullname
    email,
    password,
    vehicle: {                         // Correctly assign vehicle object
      vehicleColor,
      vehiclePlate,
      vehicleCapacity,
      vehicleType,
      vehicleModel,
      vehicleBrand,
      vehicleYear,
      vehicleNumber,
      vehicleStatus,
    },
  });
  return captain;
};
