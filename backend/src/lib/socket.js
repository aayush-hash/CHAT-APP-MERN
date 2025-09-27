import { Server } from "socket.io";
import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const server = http.createServer(app);

// Middleware (move express.json, cookieParser, cors here)
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
  credentials: true,
}));

// Store online users
const userSocketMap = {};

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // update in production
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { app, server, io };
