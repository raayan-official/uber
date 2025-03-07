import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://uber-sqyu.onrender.com";

const ConfirmRidePopUp = ({ ride, setConfirmRidePopUpPanel }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!ride) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-zinc-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-zinc-800 animate-pulse">Loading...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we prepare your experience</p>
        </div>
      </div>
    );
  }

  const user = ride.user || {};
  const userName = user.fullname?.firstname || "Unknown Driver";
  const profileImage = user.profileImage || "https://via.placeholder.com/150";
  const pickup = ride.pickup || "N/A";
  const dropoff = ride.dropoff || "N/A";
  const fare = ride.fare || "N/A";

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASE_URL}/rides/start-ride`, {
        params: { rideId: ride._id, otp: otp },  // Ensure OTP is being passed
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.status === 200) {
        setConfirmRidePopUpPanel(false);
        navigate("/captain/riding", {state: {ride: ride}});
      }
    } catch (error) {
      setError("Failed to start the ride. Please check your OTP and try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-3">Confirm this Ride to Start!</h3>
      <div className="flex items-center justify-between px-5 mt-5 bg-yellow-400 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <img className="h-12 w-12 rounded-full object-cover" src={profileImage} alt="Driver" />
          <h2 className="text-lg font-medium">{userName}</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 Km</h5>
      </div>
      <div className="flex gap-2 flex-col items-center justify-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b border-gray-400">
            <i className="ri-map-pin-2-fill text-lg"></i>
            <h3 className="text-lg font-medium">{pickup}</h3>
          </div>
          <div className="flex items-center gap-5 p-3 border-b border-gray-400">
            <i className="ri-map-pin-range-fill text-lg"></i>
            <h3 className="text-lg font-medium">{dropoff}</h3>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-bank-card-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">₹{fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center w-full mt-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form onSubmit={submitHandler} className="w-full max-w-md">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="Enter OTP"
              className="bg-[#eeeeee] px-4 py-3 text-lg font-mono rounded-lg w-full outline-none focus:ring-2 focus:ring-zinc-500 transition-all"
              maxLength="6"
            />
            <div className="flex gap-3 mt-4 w-full">
              <button
                type="submit"
                className="flex-1 text-center bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Confirming..." : "Confirm"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmRidePopUpPanel(false)}
                className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
