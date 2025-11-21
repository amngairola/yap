import React from "react";

/**
 * A full-screen loading overlay that blurs the background
 * and displays a centered spinner.
 * @param {boolean} isLoading - Controls if the overlay is visible or not.
 */
const LoadingOverlay = () => {
  return (
    <div
      className="
        fixed inset-0 z-50 
        flex flex-col items-center justify-center 
        bg-black/30 backdrop-blur-sm
      "
      aria-live="polite"
      aria-busy="true"
    >
      {/* --- The Spinner --- */}
      {/* This is a CSS-only spinner. 
          border-gray-300 is the "track"
          border-t-orange-500 is the moving "loader" part 
      */}
      <div
        className="
          w-16 h-16 
          rounded-full 
          border-4 border-gray-300 border-t-orange-500 
          animate-spin
        "
      ></div>

      {/* --- Optional Loading Text --- */}
      <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
    </div>
  );
};

export default LoadingOverlay;
