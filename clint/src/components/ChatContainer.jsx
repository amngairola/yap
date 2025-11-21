import React, { useRef, useContext, useEffect } from "react";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import NoChatSelected from "./NoChatSelected";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const ChatContainer = ({ onGoBack }) => {
  const { messages, selectedUser, sendMsg } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  // Hooks must always run in the same order, regardless of state.
  useEffect(() => {
    // We add a check for 'selectedUser' here to avoid scrolling logic if we aren't viewing a chat
    if (selectedUser && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  // 2. NOW it is safe to do the early return
  if (!selectedUser) {
    return <NoChatSelected />;
  }

  const isOnline = onlineUsers.includes(String(selectedUser._id));

  return (
    <div className="flex h-full w-full flex-col bg-black/20 text-white">
      {/* --- Header --- */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 bg-black/10 p-3 backdrop-blur-sm">
        <div className="flex items-center overflow-hidden">
          <button
            onClick={onGoBack}
            className="mr-3 rounded-full p-2 text-gray-300 hover:bg-white/10 md:hidden"
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="relative">
            <img
              src={selectedUser.profilePic || assets.avatar_icon}
              alt={selectedUser.fullName}
              className="h-10 w-10 rounded-full object-cover border border-white/10"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-gray-900"></span>
            )}
          </div>

          <div className="ml-3 overflow-hidden">
            <p className="truncate font-semibold">{selectedUser.fullName}</p>
            <p
              className={`text-xs ${
                isOnline ? "text-green-400" : "text-gray-400"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* --- Messages List --- */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-500 opacity-50 mt-20">
            <p>No messages yet.</p>
            <p className="text-sm">Send a message to start the conversation.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                text={msg.text}
                image={msg.image}
                time={msg.createdAt}
                isOwnMessage={msg.senderId === authUser._id}
                seen={msg.seen}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageInput onSendMessage={sendMsg} />
    </div>
  );
};

export default ChatContainer;
