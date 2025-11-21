import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoutes.js";

// 1. CRITICAL FIX: Import 'Server' (with a capital S) from 'socket.io'
import { Server } from "socket.io";

// --- App & Server Setup ---
const app = express();
const server = http.createServer(app);

// --- Socket.io Setup ---

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

export const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
  },
});

// Store online users
export const userSocketMap = {}; // userId : socketID

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    if (userId && userId !== "undefined") {
      delete userSocketMap[userId];
    }

    // Emit updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// --- Middleware ---
app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: corsOrigin,
    credentials: true, // Allow cookies/headers to be sent across origins
  })
);

// --- Route Setup ---
app.use("/api/status", (req, res) => {
  res.send("Server is live and running!");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// --- Connect to Database ---
await connectDB();

// --- Start Server ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
