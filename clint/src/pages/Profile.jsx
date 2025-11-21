import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import LoadingOverlay from "./LoadingOverlay"; // Ensure path is correct

// --- Utility: Convert File to Base64 (Moved outside to prevent re-creation) ---
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// --- Component: Reusable Input Field ---
const ProfileInput = ({
  id,
  label,
  value,
  onChange,
  isEditing,
  as = "input",
}) => (
  <div className="flex flex-col gap-1">
    <label
      htmlFor={id}
      className="text-xs font-medium uppercase tracking-wider text-gray-500"
    >
      {label}
    </label>
    {isEditing ? (
      React.createElement(as, {
        id,
        name: id, // Add name for easier handling
        value,
        onChange,
        className:
          "w-full rounded-lg border border-white/10 bg-zinc-800/50 p-3 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all",
        ...(as === "textarea" && { rows: 3 }),
      })
    ) : (
      <p className="rounded-lg border border-transparent px-3 py-2 text-sm text-gray-200">
        {value || <span className="italic text-gray-600">Not set</span>}
      </p>
    )}
  </div>
);

// --- Component: Avatar Upload Section ---
const AvatarUpload = ({ currentImage, isEditing, onImageChange }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="relative mx-auto mb-8 h-32 w-32 group">
      <div
        className={`relative h-full w-full overflow-hidden rounded-full border-4 ${
          isEditing ? "border-indigo-500" : "border-white/10"
        } shadow-xl`}
      >
        <img
          src={currentImage || assets.avatar_icon}
          alt="Profile"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Edit Overlay */}
        {isEditing && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-200 hover:opacity-100"
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
              className="text-white"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={onImageChange}
      />
    </div>
  );
};

// --- Main Component ---
const Profile = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    profilePic: authUser?.profilePic || null,
  });

  // Preview State
  const [imagePreview, setImagePreview] = useState(null);

  // 1. OPTIMIZATION: Cleanup Object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Size validation (5MB)
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 5) {
      toast.error("File is too large! Please select an image under 5MB.");
      return;
    }

    // Update state and create preview
    setFormData((prev) => ({ ...prev, profilePic: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const updateBody = {
        bio: formData.bio,
        fullName: formData.fullName,
      };

      // Only convert image if a new file was selected (it will be a File object)
      if (formData.profilePic instanceof File) {
        updateBody.profilePic = await toBase64(formData.profilePic);
      }

      await updateProfile(updateBody);
      // Note: Toast is usually handled in AuthContext, but redundant calls don't hurt
      setIsEditing(false);
      // Optional: navigate("/") if you want to leave the page
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      fullName: authUser.fullName,
      bio: authUser.bio,
      profilePic: authUser.profilePic,
    });
    setIsEditing(false);
    setImagePreview(null);
  };

  // --- Render ---
  if (isSaving) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center p-4 bg-black/20">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4 bg-white/5">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
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
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-white tracking-wide">
              Edit Profile
            </h1>
            <div className="w-9"></div> {/* Spacer */}
          </div>

          <div className="p-8">
            <AvatarUpload
              currentImage={imagePreview || formData.profilePic}
              isEditing={isEditing}
              onImageChange={handleImageChange}
            />

            <div className="space-y-6">
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
                value={authUser?.email}
                isEditing={false} // Email usually shouldn't be editable here
              />

              <ProfileInput
                id="bio"
                label="About Me"
                value={formData.bio}
                onChange={handleInputChange}
                isEditing={isEditing}
                as="textarea"
              />
            </div>

            {/* Actions Footer */}
            <div className="mt-10 flex items-center justify-end gap-3 pt-6 border-t border-white/10">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all"
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
