import React from "react";

const UserListItem = ({ id, name, avatar, onClick }) => (
  // The main  container for the entire item
  <div
    onClick={onClick}
    className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors duration-200"
  >
    <div className="relative flex-shrink-0">
      <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
    </div>

    <span className="md:block font-semibold text-sm ml-3">{name}</span>
  </div>
);

export default UserListItem;
