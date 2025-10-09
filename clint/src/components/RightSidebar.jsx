import React from "react";
import assets, { imagesDummyData } from "../assets/assets"; // Make sure path is correct

const RightSidebar = ({ selectedUser, onClose }) => {
  // Although the parent component handles this, it's safe to have a fallback.
  if (!selectedUser) {
    return null;
  }

  return (
    // Main container with glass effect and vertical layout
    <div className="flex h-full w-full flex-col bg-black/20 p-4 text-white">
      {/* --- Header --- */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-lg font-semibold">Profile</h3>
        {/* Close button for mobile, passed from Home.jsx */}
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* --- User Info Section --- */}
      <div className="flex flex-col items-center space-y-2 py-6 text-center">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt={selectedUser.fullName}
          className="h-24 w-24 rounded-full border-2 border-indigo-500 object-cover"
        />
        <div>
          <h2 className="text-xl font-bold">{selectedUser.fullName}</h2>
          <p className="text-sm text-gray-400">
            @{selectedUser.email.split("@")[0]}
          </p>
        </div>
        <p className="max-w-xs pt-2 text-sm text-gray-300">
          {selectedUser.bio || "This user hasn't set a bio yet."}
        </p>
      </div>

      {/* ---adtional functionality && Action Buttons --- */}
      <div className="flex items-center justify-center space-x-3 border-t border-white/10 pt-4">
        <button className="flex-1 rounded-lg bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-600/30">
          remove user
        </button>
      </div>

      {/* --- Shared Media Section --- */}
      <div className="mt-6 flex-grow overflow-y-auto">
        {/* Header with File Count and "See All" button */}
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase text-gray-400">
            Shared Media
          </h4>
          {imagesDummyData.length > 0 && (
            <button className="text-xs font-semibold text-indigo-400 hover:underline">
              See All
            </button>
          )}
        </div>

        {/* Conditionally render the grid or an "empty state" message */}
        {imagesDummyData.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 overflow-y-auto">
            {imagesDummyData.map((url, index) => (
              // Each grid item is now a self-contained interactive element
              <div
                key={index}
                onClick={() => window.open(url, "_blank")}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
              >
                {/* The Image Itself */}
                <img
                  src={url}
                  alt="Shared media"
                  className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                {/* A dark overlay that appears on hover */}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/50"></div>
                {/* An icon that appears on hover to indicate it can be opened */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // "Empty State" shown when there are no images
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 py-8 text-center">
            <p className="text-sm text-gray-500">
              No media has been shared yet.
            </p>
          </div>
        )}
      </div>

      {/* --- Logout Button (Footer) --- */}
      {/* 'mt-auto' pushes this div to the very bottom of the flex container */}
      <div className="mt-auto flex-shrink-0 border-t border-white/10 pt-4">
        <button
          // Add your logout function to onClick
          // onClick={() => handleLogout()}
          className="flex w-full items-center justify-center space-x-2 rounded-lg p-3 text-sm font-semibold text-red-400 transition-colors duration-200 hover:bg-red-500/20"
        >
          {/* Logout Icon */}
          <svg
            xmlns="http://www.w.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
