const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TaskFlow Backend is Running Successfully!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "TaskFlow API is working!"
  });
});

// Authentication APIs
app.use("/api/auth", authRoutes);

// Task APIs
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`TaskFlow server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
};

startServer();