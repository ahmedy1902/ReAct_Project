require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
require("express-async-errors");

// استيراد الراوترز مرة واحدة فقط
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const errorMiddleware = require("./middlewares/errorMiddleware");
const { globalLimiter, authLimiter } = require("./utils/rateLimiter");

// إنشاء تطبيق Express
const app = express();

// Middleware
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
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-User-Role"],
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

// توصيل قاعدة البيانات
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// استيراد النماذج
require("./models/User");

// استخدام الراوترز
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

// Global limiter should be last
app.use(globalLimiter);

// Error handling middleware (should be last)
app.use(errorMiddleware);

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
