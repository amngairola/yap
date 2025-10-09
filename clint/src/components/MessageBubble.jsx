import React from "react";
import { formatMsgTime } from "../lib/Utils";

// Seen Icon Component (no changes needed)
const SeenTick = ({ seen }) => (
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
    className={seen ? "text-blue-400" : "text-gray-500"}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const MessageBubble = ({ text, image, time, isOwnMessage, seen }) => {
  // Determine if the message is image-only for special styling
  const isImageOnly = image && !text;

  return (
    <div
      className={`flex w-full ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          relative max-w-sm overflow-hidden rounded-2xl
          ${isOwnMessage ? "rounded-br-lg" : "rounded-bl-lg"}
          ${isImageOnly ? "p-0" : "p-2.5"}
          ${
            isOwnMessage
              ? "bg-indigo-600/90 text-white"
              : "bg-zinc-700/80 text-gray-200"
          }
        `}
      >
        {/* Render the image if it exists */}
        {image && (
          <img
            src={image}
            alt="Sent media"
            // If it's image-only, the image gets rounded corners to match the bubble
            className={`max-w-full h-auto ${
              isImageOnly ? "rounded-2xl" : "rounded-lg mb-1.5"
            }`}
          />
        )}

        {text && <p className="text-sm px-1.5">{text}</p>}

        <div
          className={`
            flex items-center space-x-1.5
            ${
              isImageOnly
                ? "absolute bottom-1.5 right-2.5 rounded-lg bg-black/60 px-1.5 py-0.5 text-white backdrop-blur-sm"
                : "mt-1 justify-end"
            }
          `}
        >
          <span className="text-xs">{formatMsgTime(time)}</span>
          {isOwnMessage && <SeenTick seen={seen} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
