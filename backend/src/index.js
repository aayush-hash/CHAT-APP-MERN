import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app as socketApp, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
socketApp.use(express.json());
socketApp.use(cookieParser());
socketApp.use(
  cors({
    origin: "*", // Allow all for now, change to frontend URL in production
    credentials: true,
  })
);

// API routes
socketApp.use("/api/auth", authRoutes);
socketApp.use("/api/messages", messageRoutes);

// Serve frontend
const frontendPath = path.join(__dirname, "../../frontend/dist"); // Adjust path
socketApp.use(express.static(frontendPath));

socketApp.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
server.listen(PORT, () => {
  console.log("Server running on PORT:", PORT);
  connectDB();
});
