import React, { createContext, useState } from "react";
export const CaptainDataContext = createContext(null);
const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState({
    fullname: {
      firstName: "",
      lastName: "",
    },
    email: "",
    vehicle: {
      vehicleColor: "",
      vehiclePlate: "",
      vehicleCapacity: "",
      vehicleType: "",
      vehicleModel: "",
      vehicleBrand: "",
      vehicleYear: "",
      vehicleStatus: "",
    },
  });
  return (
    <CaptainDataContext.Provider value={{ captain, setCaptain }}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
