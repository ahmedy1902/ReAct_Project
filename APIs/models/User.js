const mongoose = require("mongoose");

// نتحقق أولاً إذا كان النموذج موجود بالفعل
const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema({
      username: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    })
  );

module.exports = User;
