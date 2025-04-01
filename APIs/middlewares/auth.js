const APIError = require("./../utils/apiError");
const jwt = require("jsonwebtoken");
const util = require("util");
const User = require("./../models/userModel");

const jwtVerify = util.promisify(jwt.verify);

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No auth token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const headerRole = req.header("X-User-Role");
    req.user = user;
    req.user.id = user._id.toString(); // Ensure we have string ID
    req.isAdmin = headerRole === "admin" || user.role === "admin";

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = auth;
