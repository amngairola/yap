import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import assets from "./assets/assets";
import SignupPage from "./pages/SignupPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname == "/login";

  const overlayClass = isLoginPage
    ? "bg-black/40"
    : "bg-zinc-950/70 backdrop-blur-lg"; //

  return (
    <div
      className="relative min-h-screen w-full bg-zinc-950 bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${assets.login_bg})` }}
    >
      {/* 2. The conditional overlay div */}
      <div className={`absolute inset-0 ${overlayClass}`}></div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* 3. page content, layered on top */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
