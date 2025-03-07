import React, { useContext } from 'react'
import {CaptainDataContext} from '../context/CaptainContext'


const CaptainDetail = () => {
  const {captain} = useContext(CaptainDataContext);
  return (
    <div className="p-6 bg-white rounded-t-3xl ">
    {/* Profile Section */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <img
          className="h-12 w-12 rounded-full object-cover border-2 border-white hover:border-blue-500 transition-all"
          src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202210/rohit_saraf-one_one.jpg?VersionId=yB39L0cvu3FTC11fiqxUuvGBPKEjxuwD"
          alt="Profile"
        />
        <div>
          <h4 className="text-lg font-semibold text-gray-800">{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
          <p className="text-sm text-gray-500">Driver</p>
        </div>
      </div>
      <div className="text-right">
        <h4 className="text-xl font-semibold text-gray-800">₹300.80</h4>
        <p className="text-sm text-gray-500">Earned</p>
      </div>
    </div>

    {/* Stats Section */}
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center p-3 bg-gray-200 rounded-lg hover:bg-gray-200 transition-colors">
        <i className="text-3xl ri-timer-2-line text-zinc-700"></i>
        <h5 className="text-lg font-semibold mt-2">10.2</h5>
        <p className="text-sm text-gray-600">Hours Online</p>
      </div>
      <div className="text-center p-3 bg-gray-200 rounded-lg hover:bg-gray-200 transition-colors">
        <i className="text-3xl ri-speed-up-line text-zinc-700"></i>
        <h5 className="text-lg font-semibold mt-2">45</h5>
        <p className="text-sm text-gray-600">Trips Completed</p>
      </div>
      <div className="text-center p-3 bg-gray-200 rounded-lg hover:bg-gray-200 transition-colors">
        <i className="text-3xl ri-file-list-3-line text-zinc-700"></i>
        <h5 className="text-lg font-semibold mt-2">4.8</h5>
        <p className="text-sm text-gray-600">Rating</p>
      </div>
    </div>
  </div>
  )
}

export default CaptainDetail
