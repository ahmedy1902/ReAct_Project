import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, toggleFavorite } from "../../features/posts/postsSlice";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const PostItem = ({ post, isOwner, showUsername }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);

  // Simplified admin check
  const isAdmin = user?.role === "admin";
  const canDelete = isAdmin || post?.user?._id === user?._id;

  console.log("Debug:", {
    userRole: user?.role,
    isAdmin,
    postUserId: post?.user?._id,
    userId: user?._id,
    canDelete,
  });

  const handleClickDelete = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deletePost(post._id)).unwrap();
      handleCloseDialog();
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(post._id));
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Card
        sx={{
          mb: 2,
          position: "relative",
          borderRadius: 2,
          "&:hover": {
            "& .MuiCardContent-root": {
              bgcolor: "rgba(0,0,0,0.01)",
            },
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box>
              <Typography variant="h6" component="h2">
                {post.title}
              </Typography>
              {showUsername && (
                <Typography variant="subtitle2" color="text.secondary">
                  Posted by: {post.user?.username}
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={handleToggleFavorite}
              color={post.isFavorite ? "warning" : "default"}
              size="small"
            >
              {post.isFavorite ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {post.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Chip
              label={formatDate(post.createdAt)}
              size="small"
              variant="outlined"
            />
            {canDelete && (
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClickDelete}
              >
                Delete {isAdmin && "(Admin)"}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostItem;
