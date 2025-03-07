import React, { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

const Payment = ({data}) => {

  const {socket} = useContext(SocketContext);
   const navigate = useNavigate();
  
   socket.on("ride-ended", ()=>{
    navigate("/user/home")
   }); 
  return (
    <div className="h-screen ">

    {/* Ride Completion Details Section */}
    <div className="bg-white p-6 flex flex-col items-center justify-center">
      {/* Ride Completion Icon */}
      <div className="mb-4">
        <i className="ri-checkbox-circle-fill text-6xl text-green-500"></i>
      </div>

      {/* Ride Completion Message */}
      <h2 className="text-2xl font-semibold mb-2">Ride Completed!</h2>
      <p className="text-gray-600 mb-4">Thank you for driving with us.</p>

      {/* Ride Details */}
      <div className="w-full max-w-md bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Distance</span>
          <span className="font-semibold">12.5 km</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Duration</span>
          <span className="font-semibold">25 mins</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Paid</span>
          <span className="font-semibold">₹{data.fare}</span>
        </div>
      </div>

    </div>
  </div>
  )
}

export default Payment
