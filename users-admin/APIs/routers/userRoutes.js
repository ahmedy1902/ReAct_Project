const express = require("express");
const userController = require("./../controllers/userController");
const auth = require("./../middlewares/auth");
const restrictTo = require("./../middlewares/restrictTo");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Routes
router.post("/register", userController.signup);

router.post("/signup", userController.signup);

router.post("/login", userController.login);

// get all users
router.get("/", userController.getAllUsers);

// ضع مسار /me قبل مسارات المعرف حتى لا يتم تفسير "me" كمعرف
router.get("/me", authMiddleware, userController.getUserProfile);

// مسارات المعرف
router.get("/:id", userController.getOneUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", auth, restrictTo('admin'), userController.deleteUser);

module.exports = router;
