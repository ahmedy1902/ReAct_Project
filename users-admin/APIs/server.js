const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
require("express-async-errors");

const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const errorMiddleware = require("./middlewares/errorMiddleware");
const { globalLimiter, authLimiter } = require("./utils/rateLimiter");

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  morgan("dev", {
    skip: (req) => req.method === "OPTIONS",
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://localhost:5178",
      "http://localhost:5179",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiters
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// Routes
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

// Global limiter should be last
app.use(globalLimiter);

// Error handling middleware (should be last)
app.use(errorMiddleware);

// Database connection
const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT || 3004;

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// Connect to MongoDB and start server
mongoose
  .connect(DB_URI, mongooseOptions)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    // Start the server only after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the process if database connection fails
  });
