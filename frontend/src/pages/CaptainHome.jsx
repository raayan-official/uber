import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import RidePopUp from "../components/RidePopUp";
import CaptainDetail from "../components/CaptainDetail";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const ridePopUpPanelRef = useRef(null);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const confirmRidePopUpPanelRef = useRef(null);
  const { captain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext);
  const [ride, setRide] = useState(null);

  useEffect(() => {
    if (captain && captain._id && socket) {
      
      socket.emit("join", { userType: "captain", userId: captain._id });
    } else {
      console.warn("⚠️ Captain or socket is not available, event not emitted.");
    }

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          

          socket.emit("update-location-captain", {
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            userId: captain._id,
          });
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();
    return () => clearInterval(locationInterval);
  }, [captain, socket]);

  socket.on("new-ride", (data) => {
    setRide(data);
    setRidePopUpPanel(true);
   
  });

  async function confirmRide() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No authentication token found!");
        return;
      }
  
      if (!ride || !ride._id || !captain || !captain._id) {
        console.error("❌ Missing ride ID or captain ID!", { ride, captain });
        return;
      }
  
      
  
      const response = await axios.post(
        `${BASE_URL}/rides/confirm`,
        { rideId: ride._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
     
  
      setRidePopUpPanel(false);
      setConfirmRidePopUpPanel(true);
    } catch (error) {
      console.error("❌ Error confirming ride:", error.response?.data || error.message);
    }
  }
  

  useGSAP(
    function () {
      if (ridePopUpPanel) {
        gsap.to(ridePopUpPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ridePopUpPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopUpPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopUpPanel) {
        gsap.to(confirmRidePopUpPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopUpPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopUpPanel]
  );
  return (
    <div className="h-screen">
      <div className="">
        <img
          className="w-16 absolute left-5 top-5"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain/logout"
          className="fixed h-10 w-10 bg-white flex items-center justify-center rounded-full right-2 top-2"
        >
          <i className="text-lg font-medium ri-logout-box-line"></i>
        </Link>
      </div>
      <div className="h-3/5 ">
        <img
          className="h-full w-full object-cover"
          src="https://img.sfist.com/assets_c/2015/07/ubermapvisuals-thumb-640xauto-905052.png"
          alt=""
        />
      </div>
      <div>
        <CaptainDetail />
      </div>

      <div
        ref={ridePopUpPanelRef}
        className="fixed w-full bg-white z-10 bottom-0 pt-12 px-3 py-6 shadow-lg translate-y-full"
      >
        <RidePopUp
          ride={ride}
          confirmRide={confirmRide}
        />
      </div>

      <div
        ref={confirmRidePopUpPanelRef}
        className="fixed h-screen w-full bg-white z-10 bottom-0 pt-12 px-3 py-6 shadow-lg translate-y-full"
      >
        <ConfirmRidePopUp
        ride={ride}
        setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} />
      </div>
    </div>
  );
};

export default CaptainHome;
