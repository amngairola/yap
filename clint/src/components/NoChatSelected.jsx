import React from "react";
import assets from "../assets/assets"; // Corrected path based on SideBar usage

const NoChatSelected = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black/20 text-white p-8 text-center">
      <div className="animate-bounce mb-6">
        <img src={assets.logo} alt="Logo" className="w-20 h-20 opacity-50" />
      </div>
      <h2 className="text-3xl font-bold text-gray-200">Welcome to Chat App</h2>
      <p className="mt-2 text-gray-500 max-w-md">
        Select a conversation from the sidebar to start chatting with your
        contacts instantly.
      </p>
    </div>
  );
};

export default NoChatSelected;
