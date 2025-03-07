import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { email: email, password: password };
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, userData);

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        if (data.user.role === "user") {
          navigate("/user/home");
        } else {
          setError("Unauthorized access. Please log in as a captain.");
          navigate("/user/login")       }
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
          className="w-16 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
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
            Don't have an account?
            <Link
              to="/user/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link
          to="/captain/login"
          className="inline-flex justify-center items-center w-full bg-[#0abe64] font-semibold text-white text-xl py-2 px-4 mt-4 rounded-lg"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
