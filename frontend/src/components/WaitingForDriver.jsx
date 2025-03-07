import React from "react";

const WaitingForDriver = ({ ride, setWaitingForDriver }) => {
  if (!ride) {
    return   <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
    <div className="text-center">
      {/* Spinning Loader */}
      <div className="w-12 h-12 border-4 border-zinc-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      
      {/* Loading Text */}
      <p className="text-2xl font-bold text-zinc-800 animate-pulse">
        Loading<span className="animate-bounce">...</span>
      </p>
      
      {/* Optional Subtext */}
      <p className="mt-2 text-sm text-gray-500">Please wait while we prepare your experience</p>
    </div>
  </div>
  };

  // Ensure ride.captain exists before accessing properties
  const captain = ride.captain || {};
  const captainName = captain.fullname ? `${captain.fullname.firstname}` : "Unknown Driver";
  const vehiclePlate = captain.vehicle?.vehiclePlate || "N/A";
  const vehicleModel = captain.vehicle?.vehicleModel || "N/A";
  const otp = ride.otp || "N/A";

  return (
    <div>
      <h5
        onClick={() => setWaitingForDriver(false)}
        className="top-3 left-5"
      >
        <i className="ri-arrow-left-line font-bold text-2xl"></i>
      </h5>
      <div className="flex items-center justify-between">
        <img
          className="h-13 object-cover"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398971/assets/29/fbb8b0-75b1-4e2a-8533-3a364e7042fa/original/UberSelect-White.png"
          alt="Uber Go"
        />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">{captainName}</h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1 capitalize">{vehiclePlate}</h4>
          <p className="text-sm text-gray-600">{vehicleModel}</p>
          <h1 className="text-lg font-semibold ">{otp}</h1>
        </div>
      </div>
      <div className="flex gap-2 flex-col items-center justify-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b border-gray-400">
            <i className="ri-map-pin-2-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{ride.pickup || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b border-gray-400">
            <i className="ri-map-pin-range-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">Dropoff</h3>
              <p className="text-sm -mt-1 text-gray-600">{ride.dropoff || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-bank-card-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">₹{ride.fare || "N/A"}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
