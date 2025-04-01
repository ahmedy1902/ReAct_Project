const Post = require("../models/posts");
const APIError = require("../utils/apiError");

const createPost = async (req, res) => {
  const { title, content } = req.body;

  // Validate data
  if (!title || !content) {
    throw new APIError("Title and content are required", 400);
  }

  const post = await Post.create({
    title,
    content,
    userId: req.user._id,
  });

  res.status(201).json({
    status: "success",
    message: "Post created successfully",
    data: { post },
  });
};

const getPosts = async (req, res) => {
  const posts = await Post.find().populate("userId", "name email");

  if (!posts?.length) {
    throw new APIError("No posts found", 404);
  }

  // Add isOwner flag for each post
  const postsWithOwnership = posts.map((post) => ({
    ...post.toObject(),
    isOwner: post.userId._id.toString() === req.user._id.toString(),
  }));

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: { posts: postsWithOwnership },
  });
};

const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "userId",
    "name email"
  );

  if (!post) {
    throw new APIError("Post not found", 404);
  }

  // Add isOwner flag
  const postWithOwnership = {
    ...post.toObject(),
    isOwner: post.userId._id.toString() === req.user._id.toString(),
  };

  res.status(200).json({
    status: "success",
    data: { post: postWithOwnership },
  });
};

const updatePost = async (req, res) => {
  const { title, content } = req.body;

  // Validate data
  if (!title || !content) {
    throw new APIError("Title and content are required", 400);
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new APIError("Post not found", 404);
  }

  // Check if user owns the post
  if (post.userId.toString() !== req.user._id.toString()) {
    throw new APIError("You can only update your own posts", 403);
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    message: "Post updated successfully",
    data: { post: updatedPost },
  });
};

const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new APIError("Post not found", 404);
  }

  // Check if user owns the post
  if (post.userId.toString() !== req.user._id.toString()) {
    throw new APIError("You can only delete your own posts", 403);
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
