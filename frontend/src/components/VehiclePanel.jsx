import React from "react";
import PropTypes from "prop-types";

const VehiclePanel = ({ setVehiclePanelOpen, setConfirmedRidePanel, fare, setVehicleType }) => {
  const handleSelection = (type) => {
    setConfirmedRidePanel(true);
    setVehiclePanelOpen(false);
    setVehicleType(type);
  };

  const vehicles = [
    {
      type: "car",
      name: "Uber Go",
      capacity: 4,
      timeAway: "2 min away",
      description: "Affordable, compact rides",
      fare: fare?.car ?? "N/A",
      image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398971/assets/29/fbb8b0-75b1-4e2a-8533-3a364e7042fa/original/UberSelect-White.png",
    },
    {
      type: "moto",
      name: "Moto",
      capacity: 1,
      timeAway: "3 min away",
      description: "Affordable motorcycle rides",
      fare: fare?.moto ?? "N/A",
      image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    },
    {
      type: "auto",
      name: "UberAuto",
      capacity: 3,
      timeAway: "2 min away",
      description: "Affordable auto rides",
      fare: fare?.auto ?? "N/A",
      image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
    },
  ];

  return (
    <div>
      <h5 onClick={() => setVehiclePanelOpen(false)} className="top-3 left-5">
        <i className="ri-arrow-left-line font-bold text-2xl"></i>
      </h5>
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-3">
        Choose a vehicle
      </h3>

      {vehicles.map((vehicle) => (
        <div
          key={vehicle.type}
          onClick={() => handleSelection(vehicle.type)}
          className="flex bg-zinc-100 border-black rounded-xl transition-all active:border-2 p-2 w-full items-center justify-between gap-3 mb-3"
        >
          <img className="h-20 object-cover" src={vehicle.image} alt={vehicle.name} />
          <div className="flex-1">
            <h4 className="font-medium text-base text-gray-800">
              {vehicle.name} <i className="ri-user-fill text-gray-600 ml-1"></i>{vehicle.capacity}
            </h4>
            <h5 className="font-medium text-xs text-gray-600 mt-1">{vehicle.timeAway}</h5>
            <p className="font-medium text-xs text-gray-500 mt-1">{vehicle.description}</p>
            <h2 className="text-lg font-semibold text-gray-900 mt-1">₹{vehicle.fare}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

VehiclePanel.propTypes = {
  setVehiclePanelOpen: PropTypes.func.isRequired,
  setConfirmedRidePanel: PropTypes.func.isRequired,
  fare: PropTypes.object,
  setVehicleType: PropTypes.func.isRequired,
};

export default VehiclePanel;
