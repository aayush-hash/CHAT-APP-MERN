import dotenv from "dotenv";
import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Connect DB and start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
  connectDB();
});
