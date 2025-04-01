const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const restrictTo = require("../middlewares/restrictTo");
const {
  signup,
  login,
  getUserProfile,
  getAllUsers,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

// Public routes
router.post("/register", signup);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getUserProfile);
router.get("/", authMiddleware, getAllUsers);

// Admin only routes
router.patch("/:id", authMiddleware, restrictTo("admin"), updateUser);
router.delete("/:id", authMiddleware, restrictTo("admin"), deleteUser);

module.exports = router;
