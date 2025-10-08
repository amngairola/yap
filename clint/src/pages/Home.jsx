import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleGoBack = () => {
    setSelectedUser(null);
  };

  return (
    <div className="h-screen w-full">
      <div className="relative h-full w-full overflow-hidden md:p-4">
        {/* Main "glass" container */}
        <div className="relative mx-auto flex h-full w-full max-w-7xl overflow-hidden md:rounded-2xl md:border md:border-white/20 md:backdrop-blur-xl">
          {/* --- Column 1: Sliding Sidebar --- */}
          {/* On mobile, this slides out of view when a user is selected */}
          <div
            className={`
                absolute top-0 left-0 z-10 h-full w-100 transform transition-transform duration-300 ease-in-out
                md:relative md:w-72 md:flex-none md:translate-x-0
                ${selectedUser ? "-translate-x-full" : "translate-x-0"}
              `}
          >
            <SideBar onUserSelect={handleUserSelect} />
          </div>

          {/* --- Column 2: Chat Container --- */}
          {/* On mobile, this slides into view when a user is selected */}
          <div
            className={`
                absolute top-0 left-0 h-full w-full transform transition-transform duration-300 ease-in-out
                md:relative md:flex-grow md:translate-x-0 md:border-l md:border-white/20
                ${selectedUser ? "translate-x-0" : "translate-x-full"}
              `}
          >
            <ChatContainer
              selectedUser={selectedUser}
              onGoBack={handleGoBack}
            />
          </div>

          {/* --- Column 3: Right Sidebar (Desktop Only) --- */}
          {/* This only appears if a user is selected AND the screen is desktop-sized */}
          {selectedUser && (
            <div className="hidden w-72 flex-none border-l border-white/20 md:block">
              <RightSidebar selectedUser={selectedUser} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
