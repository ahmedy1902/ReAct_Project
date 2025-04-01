const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllPosts,
  getUserPosts,
  createPost,
  deletePost,
  toggleFavorite,
} = require("../controllers/postController");

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

router.route("/").get(getUserPosts).post(createPost);

router.route("/:id").delete(deletePost);

router.patch("/:id/favorite", toggleFavorite);

router.get("/all", getAllPosts);
router.get("/user", getUserPosts);

module.exports = router;
