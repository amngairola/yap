import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Helper: Convert file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Create a preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview({ file, url: previewUrl });
  };

  const clearImage = () => {
    if (imagePreview?.url) {
      URL.revokeObjectURL(imagePreview.url); // Fix memory leak
    }
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      let imageData = null;
      if (imagePreview?.file) {
        imageData = await convertToBase64(imagePreview.file);
      }

      // Pass data up to parent
      await onSendMessage({ text: text.trim(), image: imageData });

      // Cleanup
      setText("");
      clearImage();
    } catch (error) {
      console.error("Failed to process message", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-white/10 p-3 bg-black/20">
      {/* Image Preview */}
      {imagePreview && (
        <div className="relative mb-3 w-fit rounded-lg bg-black/30 p-2">
          <img
            src={imagePreview.url}
            alt="Preview"
            className="max-h-40 rounded-md object-contain"
          />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white hover:bg-red-500"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          className="hidden"
          accept="image/*"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full p-2 text-gray-400 hover:text-indigo-400 transition-colors"
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
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border-none bg-gray-800/50 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={!text && !imagePreview}
          className="rounded-lg bg-indigo-600 p-2.5 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
