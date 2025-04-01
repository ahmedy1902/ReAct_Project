const util = require("util");
// const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const APIError = require("./../utils/apiError");
const Post = require("./../models/postModel");

const jwtSign = util.promisify(jwt.sign);

const signup = async (req, res) => {
  try {
    const { name, username, email, password, passwordConfirm } = req.body;

    // Check for existing user with same email or username
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create user
    const user = await User.create({
      name,
      username: username || name,
      email,
      password: hashedPassword,
      role: req.body.role || "user",
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }
    res.status(400).json({
      message: err.message || "Registration failed",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt with:", { email });

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Convert email to lowercase and find user
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("Login successful for:", email);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    message: "Users fetched successfully",
    data: {
      total: users.length,
      users,
    },
  });
  console.log("👉👉users", users);
};

const getOneUser = async (req, res) => {
  const { id } = req.params;
  // fetch user from database
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new APIError("User not found", 404);
  }
  console.log("👉👉user", user);
  // send response
  res.status(200).json({
    message: "User fetched successfully",
    data: {
      user,
    },
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Verify role validity
  if (role && !["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Prevent user from changing their own role
  if (req.user._id.toString() === id && role) {
    return res.status(403).json({ message: "You cannot change your own role" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    throw new APIError("User not found", 404);
  }
  console.log("👉👉user", user);
  res.status(204).json({
    message: "User deleted successfully",
  });
};

const getUserProfile = async (req, res) => {
  try {
    const [totalPosts, favoritePosts] = await Promise.all([
      Post.countDocuments({ user: req.user._id }),
      Post.countDocuments({ favoriteBy: req.user._id }), // Count all favorite posts
    ]);

    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      createdAt: req.user.createdAt,
      stats: {
        totalPosts,
        favoritePosts,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User role updated successfully",
    data: user,
  });
};

module.exports = {
  signup,
  login,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserRole,
};
