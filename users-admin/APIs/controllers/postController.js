const Post = require("../models/postModel");

// Get all posts for logged in user
const getUserPosts = async (req, res) => {
  try {
    const userPosts = await Post.find({ user: req.user._id })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    const postsWithFavorites = userPosts.map((post) => ({
      ...post.toJSON(),
      isFavorite: post.favoriteBy.includes(req.user._id),
    }));

    res.json(postsWithFavorites);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Create new post
const createPost = async (req, res) => {
  const post = await Post.create({
    ...req.body,
    user: req.user._id,
  });
  res.status(201).json(post);
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is admin or post owner
    if (
      req.user.role === "admin" ||
      post.user.toString() === req.user._id.toString()
    ) {
      await Post.findByIdAndDelete(req.params.id);
      return res.json({
        message: "Post deleted successfully",
        id: post._id,
      });
    }

    return res
      .status(403)
      .json({ message: "Not authorized to delete this post" });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({ message: "Error deleting post" });
  }
};

// Toggle favorite
const toggleFavorite = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const userIndex = post.favoriteBy.indexOf(req.user._id);

  if (userIndex === -1) {
    post.favoriteBy.push(req.user._id);
  } else {
    post.favoriteBy.pull(req.user._id);
  }

  await post.save();

  const populatedPost = await Post.findById(post._id).populate(
    "user",
    "username"
  );

  res.json({
    ...populatedPost.toJSON(),
    isFavorite: populatedPost.favoriteBy.includes(req.user._id),
  });
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    const postsWithFavorites = posts.map((post) => ({
      ...post.toJSON(),
      isFavorite: post.favoriteBy.includes(req.user._id),
    }));

    res.json(postsWithFavorites);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

module.exports = {
  getAllPosts,
  getUserPosts,
  createPost,
  deletePost,
  toggleFavorite,
};
