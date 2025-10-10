import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets"; // Make sure path is correct

// A reusable input component for the profile form to keep the main component clean
const ProfileInput = ({
  id,
  label,
  value,
  onChange,
  isEditing,
  as = "input",
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-400">
      {label}
    </label>
    {isEditing ? (
      // If in edit mode, render an actual input or textarea element
      React.createElement(as, {
        id: id,
        value: value,
        onChange: onChange,
        className:
          "mt-1 w-full rounded-lg border-none bg-zinc-800/50 p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500",
        ...(as === "textarea" && { rows: 3 }),
      })
    ) : (
      // If in view mode, just display the text in a <p> tag
      <p className="mt-1 p-3 text-white">{value}</p>
    )}
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const imageInputRef = useRef(null);

  // --- State for user data (replace with your actual data fetching logic) ---
  const [formData, setFormData] = useState({
    fullName: "User Name",
    email: "jane.doe@example.com",
    bio: "Lover of coffee, code, and cats. Building cool things one line at a time.",
    profilePic: "https://placehold.co/200x200/4F46E5/FFFFFF?text=JD",
  });

  // State to hold the temporary URL for the new profile picture preview
  const [imagePreview, setImagePreview] = useState(null);

  // Handles changes for text inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handles new image selection and creates a preview URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Logic for saving changes to the backend
  const handleSaveChanges = () => {
    // Your API call to save data would go here
    console.log("Saving data:", formData);
    if (imagePreview) {
      // Here you would typically upload the file from imageInputRef.current.files[0]
      // to your backend/storage service and get a new URL.
      console.log("New image to upload:", imageInputRef.current.files[0]);
    }
    setIsEditing(false);
    setImagePreview(null); // Clear the temporary preview
  };

  // Logic to cancel editing and revert changes
  const handleCancel = () => {
    // In a real app, you would refetch the original data here to discard changes.
    // For now, we just exit edit mode and clear the preview.
    setIsEditing(false);
    setImagePreview(null);
  };

  return (
    // Main container to center the content
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      {/* The main "glass" card */}
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-black/30 shadow-2xl backdrop-blur-lg">
        {/* --- Page Header --- */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
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
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <div className="w-10"></div> {/* Spacer to keep the title centered */}
        </div>

        <div className="p-6">
          {/* --- Profile Picture Section --- */}
          <div className="relative mx-auto mb-6 h-32 w-32">
            <img
              src={imagePreview || formData.profilePic || assets.avatar_icon}
              alt="Profile"
              className="h-full w-full rounded-full border-2 border-indigo-500 object-cover"
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  ref={imageInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div
                  onClick={() => imageInputRef.current.click()}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity hover:opacity-100"
                >
                  <span className="text-sm font-semibold text-white">
                    Change
                  </span>
                </div>
              </>
            )}
          </div>

          {/* --- User Details Form --- */}
          <div className="space-y-4">
            <ProfileInput
              id="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              isEditing={isEditing}
            />
            <ProfileInput
              id="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              isEditing={isEditing}
            />
            <ProfileInput
              id="bio"
              label="Your Bio"
              value={formData.bio}
              onChange={handleInputChange}
              isEditing={isEditing}
              as="textarea"
            />
          </div>

          {/* --- Action Buttons (conditionally rendered) --- */}
          <div className="mt-8 flex items-center justify-end space-x-4 border-t border-white/10 pt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="rounded-lg bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* --- Danger Zone Section --- */}
          <div className="mt-8 border-t border-red-500/30 pt-4 text-sm">
            <div className="mt-2 flex items-center justify-between">
              <p className="text-gray-400">
                Delete your account and all associated data.
              </p>
              <button className="rounded-lg border border-red-500/50 px-4 py-2 font-semibold text-red-400 transition-colors hover:bg-red-500/20">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
