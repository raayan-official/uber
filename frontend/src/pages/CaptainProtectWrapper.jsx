import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const CaptainProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "captain") {
      navigate("/captain/login");
    }

    axios
      .get(`${BASE_URL}/captains/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          setCaptain(response.data.captain);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/captain/login"); // Redirect if API call fails
      });
  }, [navigate, setCaptain]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          {/* Spinning Loader */}
          <div className="w-12 h-12 border-4 border-zinc-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          
          {/* Loading Text */}
          <p className="text-2xl font-bold text-zinc-800 animate-pulse">
            Loading<span className="animate-bounce">...</span>
          </p>
          
          {/* Optional Subtext */}
          <p className="mt-2 text-sm text-gray-500">Please wait while we prepare your experience</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
