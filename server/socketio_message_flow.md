## Socket.IO Real-Time Messaging System Documentation

### Overview
This document explains the implementation of a **real-time messaging system** using **Socket.IO** in a Node.js server. The setup allows users to send and receive live messages and keeps track of online users.

---

### 1. Initialize Socket.IO Server
```javascript
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
```
- **Purpose:** Creates a Socket.IO server instance attached to the existing HTTP server.
- **CORS:** Allows requests from any origin for easy frontend integration.

---

### 2. Store Online Users
```javascript
export const userSocketMap = {}; // userId : socketID
```
- This object maintains a mapping between **user IDs** and their **Socket IDs**.
- Example:
  ```js
  userSocketMap = {
    "user123": "socketId123",
    "user456": "socketId456"
  }
  ```

---

### 3. Handle New Connections
```javascript
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user connected with id:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
```
- When a new user connects, the `userId` is received from the frontend query.
- The `userId` and `socket.id` are saved in `userSocketMap`.
- A broadcast (`getOnlineUsers`) sends the list of all online users to every connected client.

---

### 4. Handle Disconnection
```javascript
socket.on("disconnect", () => {
  console.log("user disconnected with id:", userId);

  delete userSocketMap[userId];

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
});
```
- When a user disconnects, their ID is removed from `userSocketMap`.
- The updated list of online users is broadcast to all connected clients.

---

### 5. Sending a Message to a Specific User
```javascript
const reciverSocketId = userSocketMap[reciverId];
if (reciverSocketId) {
  io.to(reciverSocketId).emit("newMessage", newMessage);
}
```
- **Purpose:** Send a message to a specific online user.
- The `reciverSocketId` is obtained using the receiver's user ID.
- If the receiver is online, the message is sent only to that socket via `io.to()`.

---

### 6. Example Flow
1. Aman (user123) and Rahul (user456) connect to the server.
   ```js
   userSocketMap = {
     "user123": "socketId123",
     "user456": "socketId456"
   }
   ```
2. Aman sends a message to Rahul.
   - The server looks up Rahul’s socket ID.
   - Emits `newMessage` event only to Rahul.

---

### 7. Frontend Integration Example
```javascript
// Connect to the server
const socket = io("http://localhost:5000", { query: { userId: "user123" } });

// Listen for incoming messages
socket.on("newMessage", (message) => {
  console.log("New message received:", message);
});

// Listen for online users
socket.on("getOnlineUsers", (users) => {
  console.log("Online users:", users);
});
```

---

### Summary
| Functionality | Description |
|----------------|--------------|
| `userSocketMap` | Stores userId → socketId mapping |
| `connection` | Handles new user connections |
| `disconnect` | Removes user from map on logout/disconnect |
| `io.emit('getOnlineUsers')` | Broadcasts current online users to everyone |
| `io.to(reciverSocketId).emit('newMessage')` | Sends a private message to a specific user |

---

**Author:** Aman Gairola

