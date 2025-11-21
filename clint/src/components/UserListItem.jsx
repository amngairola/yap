import React from "react";

const UserListItem = ({
  id,
  name,
  avatar,
  onClick,
  onlineUsers,
  unseenMsg,
}) => {
  const isOnline = onlineUsers.includes(String(id));
  const hasUnseenMsg = unseenMsg[id] || 0;

  console.log("Rendering UserListItem:", { id, name, isOnline, hasUnseenMsg });

  return (
    // The main  container for the entire item
    <div
      onClick={onClick}
      className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors duration-200"
    >
      <div className="relative flex-shrink-0">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />

        {/* Online Status Dot */}
        {isOnline && (
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-gray-900 bg-green-500"></span>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col ml-4 flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-100 text-sm truncate">
            {name}
          </span>

          {/* --- [WHERE 2] UI: Render the Badge if count > 0 --- */}
          {hasUnseenMsg > 0 && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[1.25rem] text-center shadow-sm ml-2">
              {hasUnseenMsg}
            </span>
          )}
        </div>

        <span
          className={`text-xs ${isOnline ? "text-green-300" : "text-gray-500"}`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
};

export default UserListItem;
