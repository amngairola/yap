import React, { useState, useRef } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import MessageBubble from "./MessageBubble";
const ChatContainer = ({ selectedUser, onGoBack }) => {
  // If no user is selected, show a clean placeholder screen.
  if (!selectedUser) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-black/20 text-white">
        <svg
          className="h-24 w-24 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <path d="M9 9h.01" />
          <path d="M15 9h.01" />
        </svg>
        <h2 className="mt-4 text-2xl font-semibold text-gray-300">
          Welcome to the Chat App
        </h2>
        <p className="text-gray-500">
          Select a user from the sidebar to start a conversation.
        </p>
      </div>
    );
  }

  // ... inside the ChatContainer component definition
  const [messageText, setMessageText] = useState("");
  const [imageFile, setImageFile] = useState(null); // To hold the actual file
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // To hold the preview URL
  const imageInputRef = useRef(null); // To reset the input

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a temporary URL for the browser to display the image
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreviewUrl("");
    // This is important to allow re-selecting the same file
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
  };

  // Your handleSendMessage function would now use both messageText and imageFile
  const handleSendMessage = () => {
    console.log("Sending:", { text: messageText, image: imageFile });
    // Clear inputs after sending
    setMessageText("");
    handleClearImage();
  };

  // If a user IS selected, show the full chat interface.
  return (
    <div className="flex h-full w-full flex-col bg-black/20 text-white">
      {/* --- Header --- */}
      <div className="flex flex-shrink-0 items-center border-b border-white/10 p-3">
        {/* Back Button (Mobile Only) */}
        <button
          onClick={onGoBack}
          className="mr-3 rounded-full p-2 text-white transition-colors hover:bg-white/10 md:hidden"
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

        {/* User Avatar & Name */}
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt={selectedUser.fullName}
          className="h-10 w-10 rounded-full"
        />
        <div className="ml-3">
          <p className="text-sm font-semibold">{selectedUser.fullName}</p>
          <div className="flex items-center text-xs text-green-400">
            <span className="mr-1.5 block h-2 w-2 rounded-full bg-green-500"></span>
            Online
          </div>
        </div>
      </div>
      {/* --- Message Area --- */}
      <div className="flex flex-col-reverse flex-grow space-y-4 overflow-y-auto p-4">
        {/* Messages would be mapped here */}

        {messagesDummyData.map((msg, index) => {
          const currentUserId = selectedUser._id;
          const isOwnMessage = msg.senderId === currentUserId;

          return (
            <MessageBubble
              key={index}
              text={msg.text}
              image={msg.image}
              time={msg.createdAt}
              isOwnMessage={isOwnMessage}
              seen={msg.seen}
            />
          );
        })}

        <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
          <div className="flex-grow border-t border-white/10"></div>
          <p className="flex-shrink-0">
            This is the beginning of your conversation with{" "}
            {selectedUser.fullName}.
          </p>
          <div className="flex-grow border-t border-white/10"></div>
        </div>
      </div>

      {/* --- Message Input Footer --- */}

      {/* --- Message Input Footer --- */}
      <div className="flex-shrink-0 border-t border-white/10 p-3">
        {/* --- Image Preview Area (Conditionally Rendered) --- */}
        {imagePreviewUrl && (
          <div className="relative mb-3 w-fit rounded-lg bg-black/30 p-2">
            <img
              src={imagePreviewUrl}
              alt="Image preview"
              className="max-h-40 rounded-md"
            />
            {/* Clear Image Button */}
            <button
              onClick={handleClearImage}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white transition-transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
        )}

        {/* --- Input Controls Area --- */}
        <div className="flex items-center space-x-3">
          {/* Hidden File Input */}
          <input
            type="file"
            id="file-input"
            ref={imageInputRef} // Connect the ref
            hidden
            accept="image/*"
            onChange={handleImageChange} // Use the new handler
          />

          {/* Attach File Button */}
          <label
            htmlFor="file-input"
            className="cursor-pointer rounded-lg p-2.5 text-white transition-colors hover:bg-white/10"
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
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </label>

          {/* Text Input */}
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="w-full rounded-lg border-none bg-black/30 py-2.5 px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            className="rounded-lg bg-indigo-600 p-2.5 text-white transition-colors hover:bg-indigo-700"
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
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
