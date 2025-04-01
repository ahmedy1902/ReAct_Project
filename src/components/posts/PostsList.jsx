import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPosts,
  fetchUserPosts,
  setFilterText,
  setDateFilter,
} from "../../features/posts/postsSlice";
import PostItem from "./PostItem";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";

const PostsList = ({ mode = "user" }) => {
  const dispatch = useDispatch();
  const { posts, loading, error, filterText, dateFilter } = useSelector(
    (state) => state.posts
  );
  const { user } = useSelector((state) => state.auth);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (mode === "all") {
      dispatch(fetchAllPosts());
    } else {
      dispatch(fetchUserPosts());
    }
  }, [dispatch, mode]);

  useEffect(() => {
    // Apply filters
    let result = [...posts];

    // Text filter
    if (filterText) {
      result = result.filter((post) =>
        post.title.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);

      result = result.filter((post) => {
        const postDate = new Date(post.createdAt);

        switch (dateFilter) {
          case "today":
            return postDate >= today;
          case "week":
            return postDate >= weekAgo;
          case "month":
            return postDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Favorites filter
    if (filterType === "favorites") {
      result = result.filter((post) => post.isFavorite);
    }

    setFilteredPosts(result);
  }, [posts, filterText, dateFilter, filterType]);

  const handleSearchChange = (e) => {
    dispatch(setFilterText(e.target.value));
  };

  const handleDateFilterChange = (e) => {
    dispatch(setDateFilter(e.target.value));
  };

  if (loading && posts.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="primary">
            {mode === "user" ? "My Posts" : "All Posts"}: {filteredPosts.length}
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search by title"
              variant="outlined"
              fullWidth
              value={filterText}
              onChange={handleSearchChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by date</InputLabel>
              <Select
                value={dateFilter}
                label="Filter by date"
                onChange={handleDateFilterChange}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Post type</InputLabel>
              <Select
                value={filterType}
                label="Post type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All Posts</MenuItem>
                <MenuItem value="favorites">Favorites Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {filteredPosts.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 4, textAlign: "center" }}>
          No posts found. {mode === "user" && "Create your first post!"}
        </Typography>
      ) : (
        <Box>
          {filteredPosts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              isOwner={mode === "user" || post.user?._id === user?._id}
              showUsername={mode === "all"}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PostsList;
