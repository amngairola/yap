import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets, { userDummyData } from "./../assets/assets";
import UserListItem from "./UserListItem";

const SideBar = ({ onUserSelect }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    // Main container background changed to be semi-transparent
    <div className="flex h-full flex-col bg-black/30 p-3 text-white">
      {/* 1. Header with Logo */}
      <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-white/10">
        <img src={assets.logo} className="h-9 w-9" alt="Logo" />
      </div>

      {/* 1.5. Header with search bar */}
      <div className="flex h-16 flex-shrink-0 items-center border-b border-white/10 px-3">
        {/* Search Input Wrapper */}
        <div className="relative w-full">
          {/* Search Icon (positioned inside the input field) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <img
              src={assets.search_icon}
              className="h-5 w-5 text-gray-400"
              alt="Search"
            />
          </div>

          {/* The Input Field */}
          <input
            type="text"
            placeholder="Search"
            className="
          w-full rounded-lg border-none bg-black/20 
          py-2.5 pl-10 pr-4 text-sm text-white
          placeholder:text-gray-500
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500
          md:placeholder:text-gray-500
        "
            value=""
          />
        </div>
      </div>

      {/* 2. Connected Users List */}
      <div className="my-4 flex-grow space-y-2 overflow-y-auto">
        <p className="hidden md:block text-xs font-semibold uppercase text-gray-400 px-2 mb-2">
          Connected
        </p>

        {userDummyData.map((user) => (
          <UserListItem
            key={user._id}
            id={user._id}
            name={user.fullName}
            avatar={user?.profilePic || assets.avatar_icon}
            // This now calls the function passed down from Home.jsx
            onClick={() => onUserSelect(user)}
          />
        ))}
      </div>

      {/* 3. Settings Menu at the bottom */}
      <div className="relative mt-auto flex-shrink-0">
        {/* Clickable Profile Area */}
        <div
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="flex cursor-pointer items-center justify-center rounded-lg p-2 transition-colors duration-200 hover:bg-white/10 md:justify-start"
        >
          <img
            src="https://placehold.co/100x100/4F46E5/FFFFFF?text=Me"
            alt="My Profile"
            className="h-10 w-10 rounded-full"
          />
          <div className="hidden md:ml-3 md:flex md:flex-col">
            <span className="text-sm font-semibold">My Profile</span>
            <span className="text-xs text-gray-400">Settings</span>
          </div>
          <img
            src={assets.menu_icon}
            className="ml-auto hidden w-5 md:block"
            alt="Menu"
          />
        </div>

        {/* Pop-up Menu  */}
        <div
          className={`
            absolute bottom-full left-0 mb-2 w-full origin-bottom transform
            transition-all duration-200 ease-in-out
            ${
              isMenuOpen
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
            }
          `}
        >
          {/* Pop-up menu background changed to be semi-transparent */}
          <div className="rounded-lg bg-zinc-800/90 p-1.5 shadow-lg backdrop-blur-sm">
            <div
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-white/10"
            >
              Edit Profile
            </div>
            <div className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300">
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
