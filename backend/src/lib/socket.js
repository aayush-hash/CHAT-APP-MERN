import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// Express app
const app = express();

// HTTP server
const server = http.createServer(app);

// Socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
    credentials: true,
  },
});

// Store online users
const userSocketMap = {}; // { userId: socketId }

// Helper function to get socket id
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const frontendPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendPath));

  // Catch-all route for React Router
  app.get("/*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

export { app, server, io };
