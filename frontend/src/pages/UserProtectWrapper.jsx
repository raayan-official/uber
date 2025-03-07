import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://uber-3m2i.onrender.com";

const UserProtectWrapper = ({ children }) => {
     const navigate = useNavigate();
      const { user, setUser } = useContext(UserDataContext);
      const [isLoading, setIsLoading] = useState(true);
 
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token || role !== "user") {
         
          return navigate("/user/login");
        }
    
        axios
        .get(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
       
          if (response.status === 200) {
            setUser(response.data.user);
          }
        })
        .catch((error) => {
       
          navigate("/user/login"); // Redirect if API call fails
        })
        .finally(() => setIsLoading(false));
    }, [navigate, setUser]);
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            {/* Spinning Loader */}
            <div className="w-12 h-12 border-4 border-zinc-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            
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

export default UserProtectWrapper;
