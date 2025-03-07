import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://uber-3m2i.onrender.com";

const FinishRide = ({ rideData }) => {
  const navigate = useNavigate();

  async function endRide() {
    try {
      const response = await axios.post(
        `${BASE_URL}/rides/end-ride`,
        {
          rideId: rideData._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/captain/home");
      }
    } catch (error) {
      console.error("Error ending ride:", error.response?.data?.message || error.message);
      alert("Failed to finish ride. Please try again.");
    }
  }

  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-3">
        Complete this Ride
      </h3>
      <div className="flex items-center justify-between px-5 mt-5 bg-yellow-400 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <img
            className="h-12 rounded-full object-cover w-12"
            src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202210/rohit_saraf-one_one.jpg"
            alt="User"
          />
          <h2 className="text-lg font-medium">{rideData.user?.fullname?.firstname}</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 Km</h5>
      </div>
      <div className="flex gap-2 flex-col items-center justify-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b border-gray-400">
            <i className="ri-map-pin-2-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{rideData.pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b border-gray-400">
            <i className="ri-map-pin-range-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">Dropoff</h3>
              <p className="text-sm -mt-1 text-gray-600">{rideData.dropoff}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-bank-card-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">₹{rideData.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center justify-center w-full mt-6">
          <button
            onClick={endRide}
            className="w-full text-center bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Finish Ride
          </button>
          <p className="text-red-600 mt-2 text-center text-xs">
            Click on "Finish Ride" only after completing payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinishRide;
