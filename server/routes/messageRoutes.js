import express from "express";
import { protectRoute } from "../middleware/auth.js";

import {
  getAllMessages,
  getUserforSidebar,
  markMsgsAsSeen,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUserforSidebar);
messageRouter.get("/:id", protectRoute, getAllMessages);
messageRouter.put("/mark/:id", protectRoute, markMsgsAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
