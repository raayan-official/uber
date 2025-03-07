import React from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import CaptainLogout from "./pages/CaptainLogout";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import { User } from "lucide-react";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/riding" element={<UserProtectWrapper><Riding/></UserProtectWrapper>} />
        <Route path="/user/register" element={<UserSignup />} />
        <Route path="/captain/register" element={<CaptainSignup />} />
        <Route path="/captain/login" element={<CaptainLogin />} />
        <Route path="/captain/riding" element={<CaptainProtectWrapper><CaptainRiding /></CaptainProtectWrapper>} />
        <Route path="/captain/home" element={<CaptainProtectWrapper><CaptainHome /></CaptainProtectWrapper>} />
        <Route path="/captain/logout" element={<CaptainProtectWrapper><CaptainLogout /></CaptainProtectWrapper>} />
        <Route path="/user/home" element={<UserProtectWrapper><Home/></UserProtectWrapper>} />
        <Route path="/user/logout" element={<UserProtectWrapper><UserLogout/></UserProtectWrapper>} />
      </Routes>
    </div>
  );
};

export default App;
