import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://uber-sqyu.onrender.com";

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  const navigate = useNavigate();

  const { captain, setCaptain } = useContext(CaptainDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    setError(""); // Clear any previous errors
    const newCaptain = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      role: "captain",
      vehicle: {
        vehicleColor: vehicleColor,
        vehiclePlate: vehiclePlate,
        vehicleCapacity: vehicleCapacity,
        vehicleType: vehicleType,
        vehicleModel: vehicleModel,
        vehicleBrand: vehicleBrand,
        vehicleYear: vehicleYear,
        vehicleStatus: vehicleStatus,
      },
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/captains/signup`,
        newCaptain
      );

      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "captain");
        navigate("/captain/login");
      }
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
    // Clear form fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
    setVehicleModel("");
    setVehicleBrand("");
    setVehicleYear("");
    setVehicleStatus("");
  };

  return (
    <div className="p-7 flex flex-col justify-between h-screen">
      <div>
        <img
          className="w-20 mb-5"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSVCO4w_adxK32rCXFeKq3_NbLcR9b_js14w&s"
          alt=""
        />
        <form onSubmit={handleSubmit} action="">
          <h3 className="text-lg mb-2 font-medium">
            What's our Captain's Name?
          </h3>
          <div className="flex gap-3 mb-6">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 text-lg placeholder:text-base outline-none"
              required
              type="text"
              placeholder="First name"
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 text-lg placeholder:text-base outline-none"
              required
              type="text"
              placeholder="Last name"
            />
          </div>
          <h3 className="text-lg mb-2 font-medium">
            What's our Captain's Email?
          </h3>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-6 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base outline-none"
            required
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-lg font-medium mb-2 ">
            Enter our Captain's Password
          </h3>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-6 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base outline-none"
            required
            type="password"
            placeholder="password"
          />
          <h3 className="text-lg font-medium mb-2 ">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              className="bg-[#eeeeee] rounded-lg px-4 py-2 text-lg placeholder:text-base outline-none"
              required
              type="text"
              placeholder="Vehicle Color"
            />
            <input
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              className="bg-[#eeeeee] rounded-lg px-4 py-2 text-lg placeholder:text-base outline-none"
              required
              type="text"
              placeholder="Vehicle Plate"
            />
            <input
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
              className="bg-[#eeeeee] rounded-lg px-4 py-2 text-lg placeholder:text-base outline-none"
              required
              type="number"
              placeholder="Vehicle Capacity"
            />
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="bg-[#eeeeee] rounded-lg px-4 py-2 text-lg placeholder:text-base outline-none"
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">car</option>
              <option value="moto">moto</option>
              <option value="auto">auto</option>
            </select>
            <input
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              className="bg-[#eeeeee] rounded-lg px-4 py-2 text-lg placeholder:text-base outline-none"
              required
              type="text"
              placeholder="Vehicle Model"
            />
            <input
              value={vehicleBrand}
              onChange={(e) => setVehicleBrand(e.target.value)}
              className="bg-[#eeeeee] rounded-lg px-4 py-2 text-lg placeholder:text-base outline-none"
              required
              type="text"
              placeholder="Vehicle Brand"
            />
            <input
              value={vehicleYear}
              onChange={(e) => setVehicleYear(e.target.value)}
              className="bg-[#eeeeee] rounded-lg px-4 py-2 text-lg placeholder:text-base outline-none"
              required
              type="number"
              placeholder="Vehicle Year"
            />
            <select
              value={vehicleStatus}
              onChange={(e) => setVehicleStatus(e.target.value)}
              className="bg-[#eeeeee] rounded-lg px-4 py-2 text-lg placeholder:text-base outline-none"
              required
            >
              <option value="">Select Vehicle Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <button className=" w-full bg-black font-semibold text-white text-xl py-2 px-4 pt-4 mb-2 rounded-lg">
            Create Captain account
          </button>
          <p className="text-center mb-3">
            Already have an account?
            <Link
              to="/captain/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
      <div>
        <p className="text-[10px] leading-tight mb-3.5 text-zinc-400">
          By proceeding, you consent to get calls, WhatsApp or SMS/RCS messages,
          including by automated means, from Uber and its affiliates to the
          number provided.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
