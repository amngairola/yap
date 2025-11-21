import User from "../models/user.js";
import Message from "./../models/message.js";
import cloudinary from "../lib/cloudinary.js";

import { io, userSocketMap } from "../server.js";

/**
 * @route GET /api/users
 * @description Get all users for the sidebar, excluding the currently logged-in user.
 * Also counts the number of unseen messages from each user.
 * @access Private
 */
export const getUserforSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all users except the logged-in user
    const filterdUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // --- Count Unseen Messages ---
    const unseenMsg = {};

    const promises = filterdUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        reciverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMsg[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filterdUsers,
      unseenMsg,
    });
  } catch (error) {
    console.log("Error in getUserforSidebar controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @route GET /api/messages/:id
 * @description Get all messages between the logged-in user and a selected user.
 * @access Private
 */
export const getAllMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, reciverId: selectedUserId },
        { senderId: selectedUserId, reciverId: myId },
      ],
    });

    // --- Mark Messages as Seen ---
    await Message.updateMany(
      { senderId: selectedUserId, reciverId: myId, seen: false },
      { seen: true }
    );

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("Error in getAllMessages controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const markMsgsAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({
      success: true,
    });
  } catch (error) {
    console.log("Error in markMsgsAsSeen controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @route POST /api/messages/send/:id
 * @description Send a message with optional image
 */
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const reciverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // --- THE FIX IS HERE ---
      // Replace "your_cloudinary_preset_name" with your actual preset.
      // If you followed standard setup, it is likely "ml_default".
      // IMPORTANT: Ensure this preset is set to "Unsigned" in Cloudinary settings.
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "ml_default",
      });
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      reciverId,
      text,
      image: imageUrl,
    });

    // Real-time socket emit
    const reciverSocketId = userSocketMap[reciverId];
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage: ", error.message);
    // If this logs "Invalid upload_preset", go to Cloudinary Dashboard -> Settings -> Upload -> Upload presets
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
