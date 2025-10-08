import React from "react";

const ChatContainer = ({ user, onToggleSidebar, onGoBack }) => {
  return (
    <div>
      <button
        onClick={onGoBack}
        className="mr-4 p-2 rounded-full hover:bg-white/10 md:hidden bg-white"
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
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default ChatContainer;
