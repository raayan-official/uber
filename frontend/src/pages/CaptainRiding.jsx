import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";


const CaptainRiding = () => {

const [finishRidePanel, setFinishRidePanel] = useState(false);
const finishRidePanelRef = useRef(null);
const location = useLocation();
const rideData = location.state?.ride;

    useGSAP(
        function () {
          if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
              transform: "translateY(0)",
            });
          } else {
            gsap.to(finishRidePanelRef.current, {
              transform: "translateY(100%)",
            });
          }
        },
        [finishRidePanel]
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
    <div className="h-4/5 ">
      <img
        className="h-full w-full object-cover"
        src="https://img.sfist.com/assets_c/2015/07/ubermapvisuals-thumb-640xauto-905052.png"
        alt=""
      />
    </div>
    <div onClick={()=> setFinishRidePanel(true)}  className="h-1/5 bg-yellow-400 p-6 flex items-center justify-between relative ">
    <h5  className="top-0 p-1 w-[90%] absolute text-center">
    <i className="ri-arrow-up-wide-fill font-bold text-2xl"></i>
      </h5>
    <h4 className='text-xl font-semibold'>4 KM Away</h4>
    <button  className=" text-center mt-5 bg-black text-white font-semibold p-3 rounded-lg">Complete Ride</button>

    </div>

    <div
        ref={finishRidePanelRef}
        className="fixed w-full bg-white z-10 bottom-0 px-3 py-6 shadow-lg translate-y-full"
      >
     <FinishRide rideData={rideData} setFinishRidePanel={setFinishRidePanel}/>
      </div>
    
  </div>
  )
}

export default CaptainRiding
