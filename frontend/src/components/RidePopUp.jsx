import React from "react";

const RidePopUp = ({  ride , confirmRide}) => {
  return (
    <div>
         
      <h3 className="text-center text-lg font-semibold text-gray-800 mb-3">
        New Ride Available!
      </h3>
      <div className="flex items-center justify-between px-5 mt-5 bg-yellow-400 rounded-lg p-3">
        <div className="flex items-center gap-3">
            <img className="h-12 rounded-full object-cover w-12" src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202210/rohit_saraf-one_one.jpg?VersionId=yB39L0cvu3FTC11fiqxUuvGBPKEjxuwD" alt="" />
            <h2 className="text-lg font-medium">{ride?.user.fullname.firstname + " " + ride?.user.fullname.lastname}</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 Km</h5>
      </div>
      <div className="flex gap-2 flex-col items-center justify-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-1 border-gray-400">
            <i className="ri-map-pin-2-fill text-lg  "></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">{ride?.pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-1 border-gray-400">
            <i className="ri-map-pin-range-fill  text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">{ride?.dropoff}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 ">
            <i className="ri-bank-card-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">₹{}{ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
      <div className="flex gap-2 mt-4 items-center justify-center w-full">
      <button onClick={()=>{confirmRide();}} className=" bg-green-600 text-white font-semibold p-3 px-8 rounded-lg">
         Accept
        </button>
        <button onClick={()=> setRidePopUpPanel(false)} className=" bg-gray-500 text-white font-semibold p-3 px-10 rounded-lg">
         Ignore
        </button>
      </div>
      </div>
    </div>
  );
};

export default RidePopUp;
