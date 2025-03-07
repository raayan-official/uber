import React from "react";

const ConfirmedRide = ({
  setVehiclePanelOpen,
  setConfirmedRidePanel,
  setVehicleFound,
  createRide,
  fare,
  pickup,
  destination,
  vehicleType,
}) => {
  

  // Mapping vehicle types to images
  const vehicleImages = {
    car: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398971/assets/29/fbb8b0-75b1-4e2a-8533-3a364e7042fa/original/UberSelect-White.png",
    moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  };

  return (
    <div>
      <h5
        onClick={() => {
          setVehiclePanelOpen(false);
          setConfirmedRidePanel(false);
        }}
        className="top-3 left-5"
      >
        <i className="ri-arrow-left-line font-bold text-2xl"></i>
      </h5>
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-3">
        Confirm your Ride
      </h3>
      <div className="flex gap-2 flex-col items-center justify-center">
        <img className="h-30 object-cover" src={vehicleImages[vehicleType]} alt={vehicleType} />

        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b border-gray-400">
            <i className="ri-map-pin-2-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup Location</h3>
              <p className="text-sm -mt-1 text-gray-600">{pickup}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b border-gray-400">
            <i className="ri-map-pin-range-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">{destination}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3">
            <i className="ri-bank-card-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">₹{vehicleType ? fare[vehicleType] : "N/A"}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setVehicleFound(true);
            createRide();
            setConfirmedRidePanel(false);
          }}
          className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmedRide;
