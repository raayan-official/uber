import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Start = () => {
  return (
    <div>
      <div className="bg-cover bg-center bg-[url(https://i.pinimg.com/736x/65/77/43/6577436e320529cef9f947e750cd0592.jpg)] pt-8 w-full h-screen flex justify-between flex-col">
        <img
          className="w-16 ml-9 invert"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <div className="bg-black py-4 px-4 pb-7">
          <h2 className="text-3xl font-bold text-white text-center">
            Get started With Uber
          </h2>
          <Link to="/user/login" className="inline-flex items-center justify-center w-full bg-white text-black text-xl py-3 mt-4 rounded-lg">
            Continue <ArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
