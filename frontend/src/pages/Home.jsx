import React, { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";


const BASE_URL = import.meta.env.VITE_BASE_URL || "https://uber-sqyu.onrender.com";


const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const confirmenRideRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmedRidePanel, setConfirmedRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState(null);
  const [ride, setRide] = useState(null);
  const [vehicleType, setVehicleType] = useState(null);
  const { user } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (!user || !user._id || !socket) return;

  
    socket.emit("join", { userType: "user", userId: user._id });

    socket.on("ride-confirmed", (ride) => {
     
      setWaitingForDriver(true);
      setVehicleFound(false);
      setRide(ride);
      
    });

    return () => {
      socket.off("ride-confirmed");
    };
  }, [user, socket]);

  socket.on('ride-started', data =>{
    setWaitingForDriver(false),
    navigate("/user/riding", {state: {data}})
    
  });

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      const response = await axios.get(`${BASE_URL}/maps/getsuggestions`, {
        params: { input: e.target.value },
      });
     
      setPickupSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setPickupSuggestions([]);
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(`${BASE_URL}/maps/getsuggestions`, {
        params: { input: e.target.value },
      });
      setDestinationSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setDestinationSuggestions([]);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const findTrip = async () => {
    try {
      // Close panels before making API call
      setPanelOpen(false);
      setVehiclePanelOpen(true);

      // Make GET request with correct endpoint and query params
      const response = await axios.get(`${BASE_URL}/rides/getfare`, {
        params: { pickup, dropoff: destination }, // Ensure correct parameter names
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFare(response.data.fare); // Assuming the response contains the fare data
    } catch (error) {
      console.error("Error fetching fare:", error.response?.data || error.message);
    }
  };

  async function createRide() {
    try {
      const response = await axios.post(
        `${BASE_URL}/rides/create`,
        {
          pickup,
          dropoff: destination,
          vehicleType,
          fare,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error creating ride:", error.response?.data || error.message);
    }
  }

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "65%",
          opacity: 1,
          padding: "24",
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: "0",
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );
  useGSAP(
    function () {
      if (vehiclePanelOpen) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanelOpen]
  );

  useGSAP(
    function () {
      if (confirmedRidePanel) {
        gsap.to(confirmenRideRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmenRideRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmedRidePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
       <Link
        to="/user/logout"
        className="fixed h-10 w-10 bg-white flex items-center justify-center rounded-full right-2 top-2 shadow-md"
      >
       <i className="text-lg font-medium ri-logout-box-line"></i>
      </Link>
      <div className="h-screen w-screen ">
        <img
          className="h-full w-full object-cover"
          src="https://img.sfist.com/assets_c/2015/07/ubermapvisuals-thumb-640xauto-905052.png"
          alt=""
        />
      </div>
      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[35%] bg-white p-5  relative">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0 top-3 left-5"
          >
            <i className="ri-arrow-left-line font-bold text-2xl"></i>
          </h5>
          <h4 className="text-2xl font-semibold text-center">Plan your ride</h4>
          <form onSubmit={submitHandler}>
            <div className="absolute left-9 top-[33%] h-3 w-3 bg-zinc-800 rounded-full"></div>
            <div className="line absolute h-14 w-1 top-[39%] left-10 bg-zinc-800 rounded-full "></div>
            <div className="absolute left-9 bottom-18 h-3 w-3 bg-zinc-800 rounded-full"></div>
            <input
              onClick={() => {
                setActiveField("pickup");
                setPanelOpen(true);
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eeeeee] px-12 py-2 text-base rounded-lg w-full mt-5 outline-none"
              type="text"
              placeholder="Enter pickup location"
            />

            <input
              onClick={() => {
                setActiveField("destination");
                setPanelOpen(true);
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eeeeee] px-12 py-2 text-base rounded-lg w-full mt-3 outline-none"
              type="text"
              placeholder="Where to?"
            />
          </form>
          <button onClick={findTrip} className="bg-black text-white px-4 py-2 rounded-lg mt-3  w-full">
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className="bg-white  h-0 ">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions.data || []
                : destinationSuggestions.data || []
            }
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className=" fixed w-full bg-white z-10 bottom-0 pt-12 px-3 py-6 shadow-lg translate-y-full"
      >
        <VehiclePanel
          setVehicleType={setVehicleType}
          fare={fare}
          setConfirmedRidePanel={setConfirmedRidePanel}
          setVehiclePanelOpen={setVehiclePanelOpen}
        />
      </div>

      <div
        ref={confirmenRideRef}
        className=" fixed w-full bg-white z-10 bottom-0 pt-12  px-3 py-6 shadow-lg translate-y-full"
      >
        <ConfirmedRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
          setConfirmedRidePanel={setConfirmedRidePanel}
          setVehiclePanelOpen={setVehiclePanelOpen}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className=" fixed w-full bg-white z-10 bottom-0 pt-12  px-3 py-6 shadow-lg translate-y-full"
      >
        <LookingForDriver vehicleType={vehicleType} fare={fare} pickup={pickup} destination={destination} setVehicleFound={setVehicleFound} />
      </div>
      <div
        ref={waitingForDriverRef}
        className=" fixed w-full bg-white z-10 bottom-0 pt-12  px-3 py-6 shadow-lg translate-y-full"
      >
        <WaitingForDriver
          setWaitingForDriver={setWaitingForDriver}
          ride={ride}
        />
      </div>
    </div>
  );
};

export default Home;
