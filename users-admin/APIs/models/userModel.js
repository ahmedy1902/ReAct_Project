const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Add virtual for password confirmation
userSchema.virtual("passwordConfirm").set(function (value) {
  this._passwordConfirm = value;
});

// إضافة دالة matchPassword
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// قبل حفظ المستخدم، اضبط username إذا لم يتم توفيره
userSchema.pre("save", function (next) {
  if (!this.username && this.name) {
    this.username = this.name;
  }
  next();
});

// Create compound index for better query performance
userSchema.index({ email: 1, username: 1 });

// Models
const User = mongoose.model("User", userSchema);

module.exports = User;
