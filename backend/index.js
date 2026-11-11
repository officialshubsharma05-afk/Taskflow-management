
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to TaskFlow Backend!"
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "TaskFlow server is running!"
  });
});

// Task management routes
app.use("/api/tasks", taskRoutes);

// Connect MongoDB and start server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected successfully!");

    app.listen(PORT, () => {
      console.log(`TaskFlow server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();