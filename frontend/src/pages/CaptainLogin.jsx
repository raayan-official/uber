import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext';
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
const navigate = useNavigate();
const {captain, setCaptain} = useContext(CaptainDataContext);

const handleSubmit = async(e) => {
  e.preventDefault();
  const captainData = { email: email, password: password };
      try {
        const response = await axios.post(`${BASE_URL}/captains/login`, captainData);
  
        if (response.status === 200) {
          const data = response.data;
          setCaptain(data.captain);
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.captain.role);
          if (data.captain.role === "captain") {
            navigate("/captain/home");
          } else {
            setError("Unauthorized access. Please log in as a captain.");
            navigate("/captain/login")
          }
        }
      } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Login Failed. Please try again.");
      }
      setEmail("");
      setPassword("");
    };
  return (
    <div className="p-7 flex flex-col justify-between h-screen">
    <div>
      <img
        className="w-20 mb-10"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSVCO4w_adxK32rCXFeKq3_NbLcR9b_js14w&s"
        alt=""
      />
      <form onSubmit={handleSubmit} action="">
        <h3 className="text-lg mb-2 font-medium">What's Your Email?</h3>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base outline-none"
          required
          type="email"
          placeholder="email@example.com"
        />
        <h3 className="text-lg font-medium mb-2 ">Enter Your Password</h3>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base outline-none"
          required
          type="password"
          placeholder="password"
        />
        <button className=" w-full bg-black font-semibold text-white text-xl py-2 px-4 pt-4 mb-2 rounded-lg">
          Login
        </button>
        <p className="text-center">
        Want to join as a Fleet Captain?  

          <Link to="/captain/register" className="text-blue-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
    <div>
      <Link
        to="/user/login"
        className="inline-flex justify-center items-center w-full bg-[#e09913] font-semibold text-white text-xl py-2 px-4 mt-4 rounded-lg"
      >
        Sign in as User
      </Link>
    </div>
  </div>
  )
}

export default CaptainLogin
