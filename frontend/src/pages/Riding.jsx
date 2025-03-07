import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Payment from "../components/Payment";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Riding = () => {
  const location = useLocation();
  const { data } = location.state || {}; // Ensure data is always defined
 

  const [paymentPannel, setPaymentPannel] = useState(false);
  const paymentRef = useRef(null); // Correct ref naming convention

  useGSAP(
    () => {
      if (paymentPannel) {
        gsap.to(paymentRef.current, {
          y: 0, // Move up to show panel
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(paymentRef.current, {
          y: "100%", // Move down to hide panel
          duration: 0.5,
          ease: "power2.in",
        });
      }
    },
    [paymentPannel] // Only re-run when this state changes
  );

  return (
    <div className="h-screen relative">
      {/* Home Button */}
      <Link
        to="/user/home"
        className="fixed h-10 w-10 bg-white flex items-center justify-center rounded-full right-2 top-2 shadow-md"
      >
        <i className="text-lg font-medium ri-home-4-line"></i>
      </Link>

      {/* Ride Map Section */}
      <div className="h-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://img.sfist.com/assets_c/2015/07/ubermapvisuals-thumb-640xauto-905052.png"
          alt="Uber Ride Map"
        />
      </div>

      {/* Ride Info Section */}
      <div className="h-1/2 p-4 bg-white rounded-t-lg shadow-lg">
        <div className="flex items-center justify-between">
          {/* Uber Logo */}
          <img
            className="h-13 object-cover"
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398971/assets/29/fbb8b0-75b1-4e2a-8533-3a364e7042fa/original/UberSelect-White.png"
            alt="Uber Go"
          />

          {/* Captain Info */}
          <div className="text-right">
            <h2 className="text-lg font-medium">
              {data?.captain?.fullname?.firstname || "Unknown Captain"}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {data?.captain?.vehicle?.vehiclePlate || "No Plate"}
            </h4>
            <p className="text-sm text-gray-600">
              {data?.captain?.vehicle?.vehicle || "Unknown Vehicle"}
            </p>
          </div>
        </div>

        {/* Ride Details */}
        <div className="mt-5">
          {/* Dropoff */}
          <div className="flex items-center gap-5 p-3 border-b border-gray-400">
            <i className="ri-map-pin-range-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">{data?.dropoff || "Unknown Dropoff"}</p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center gap-5 p-3">
            <i className="ri-bank-card-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">₹{data?.fare || "N/A"}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          className="w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-700 transition-all"
          onClick={() => setPaymentPannel(true)}
        >
          Make a Payment
        </button>
      </div>

      {/* Payment Panel */}
      <div
        ref={paymentRef}
        className="fixed w-full h-screen bg-white z-10 bottom-0 pt-12 px-3 py-6 shadow-lg"
        style={{ transform: "translateY(100%)" }} // Initial hidden state
      >
        <Payment data={data}/>
      </div>
    </div>
  );
};

export default Riding;
