// Import necessary libraries and models
import cloudinary from "../lib/cloudinary.js";
// 2. TYPO FIX: Changed 'genrateToken' to 'generateToken' for clarity.
// Make sure this matches the export from your utils.js file.
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

/**
 * @route POST /api/auth/signup
 * @description Registers a new user.
 * @access Public
 */
// 2. TYPO FIX: Changed 'singup' to 'signup'
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, bio, agreedToTerms } = req.body;

    // --- Input Validation ---
    if (!fullName || !email || !password || !bio || !agreedToTerms) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // --- Check for Existing User ---
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // --- Password Hashing ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Create New User ---
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
      agreedToTerms,
    });

    // --- Generate JWT Token ---
    // 2. TYPO FIX: Using 'generateToken'
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @route POST /api/auth/login
 * @description Logs in an existing user.
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    // --- Password Verification ---
    const isPasswordCorrect =
      userData && (await bcrypt.compare(password, userData.password));

    if (!userData || !isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // --- Generate JWT Token ---
    // 2. TYPO FIX: Using 'generateToken'
    const token = generateToken(userData._id);

    res.status(200).json({
      success: true,
      userData,
      token,
      message: "Login successful.",
    });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @route GET /api/auth/check
 * @description Checks if a user is authenticated.
 * @access Private (requires protectRoute)
 */
export const checkAuth = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user, // Send back the authenticated user's data
  });
};

/**
 * @route PUT /api/auth/update-profile
 * @description Updates the profile of the currently logged-in user.
 * @access Private (requires protectRoute)
 */
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updateData = { bio, fullName };

    // --- Handle Profile Picture Upload ---
    if (profilePic) {
      // 3. IMPORTANT: Check for your preset name

      const upload = await cloudinary.uploader.upload(profilePic, {
        upload_preset: "ml_default", // <-- PASTE YOUR PRESET NAME HERE
      });
      updateData.profilePic = upload.secure_url;
    }

    // --- Update User in Database ---
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // This ensures the updated document is returned
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log("Error in updateProfile controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
