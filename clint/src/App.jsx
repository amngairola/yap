import React, { useContext, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import assets from "./assets/assets";
import SignupPage from "./pages/SignupPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname == "/login";

  const overlayClass = isLoginPage
    ? "bg-black/40"
    : "bg-zinc-950/70 backdrop-blur-lg"; //

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { authUser } = useContext(AuthContext);

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
      <Toaster />
      {/* 3. page content, layered on top */}
      <div className="relative z-10">
        <Routes>
          <Route
            path="/"
            element={
              // 3. If the user is authenticated, show Home. Otherwise, redirect to /login.
              authUser ? <Home /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={
              // 4. If the user is already authenticated, redirect them away from the login page.
              authUser ? <Navigate to="/" /> : <LoginPage />
            }
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
