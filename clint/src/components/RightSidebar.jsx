import React, { useContext, useMemo } from "react";
import assets, { imagesDummyData } from "../assets/assets"; // Make sure path is correct
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = ({ onClose }) => {
  // Although the parent component handles this, it's safe to have a fallback.

  const { messages, selectedUser } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const isOnline = onlineUsers.includes(String(selectedUser._id));

  const sharedMedia = useMemo(() => {
    if (!messages) return [];

    return messages.filter((msg) => msg.image).reverse();
  }, [messages]);

  if (!selectedUser) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col bg-black/20 border-l border-white/10 text-white">
      {/* --- Header --- */}
      <div className="flex flex-shrink-0 items-center justify-between p-4 border-b border-white/10 bg-black/10 backdrop-blur-sm">
        <h3 className="text-lg font-semibold">Contact Info</h3>
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

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {/* User Info Section */}
        <div className="flex flex-col items-center py-6 text-center">
          <div className="relative mb-4">
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt={selectedUser.fullName}
              className="h-24 w-24 rounded-full border-4 border-black/30 object-cover shadow-xl"
            />
            {isOnline && (
              <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-black/30"></div>
            )}
          </div>

          <h2 className="text-xl font-bold">{selectedUser.fullName}</h2>
          <p className="text-sm text-gray-400 mb-4">{selectedUser.email}</p>

          <div className="w-full rounded-xl bg-white/5 p-3 text-sm text-gray-300 backdrop-blur-sm">
            <p>{selectedUser.bio || "No bio available."}</p>
          </div>
        </div>

        {/* Shared Media Section */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Shared Media ({sharedMedia.length})
            </h4>
          </div>

          {sharedMedia.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {sharedMedia.map((message) => (
                <div
                  key={message._id}
                  onClick={() => window.open(message.image, "_blank")}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-800"
                >
                  <img
                    src={message.image}
                    alt="Shared"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 py-8 text-center">
              <p className="text-sm text-gray-500">No media shared yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Footer Actions --- */}
      <div className="p-4 border-t border-white/10 bg-black/10 backdrop-blur-sm">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-red-500/10 p-3 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
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
