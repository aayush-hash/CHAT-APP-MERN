import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express(); // Only for Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
    credentials: true,
  },
});

// Store online users
const userSocketMap = {};

// Helper function
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Socket.io events
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
