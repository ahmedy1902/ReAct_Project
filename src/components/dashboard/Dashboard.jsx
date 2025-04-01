import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PostsList from "../posts/PostsList";

const Dashboard = ({ mode = "user" }) => {
  const isUserPosts = mode === "user";

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            {isUserPosts ? "My Posts" : "All Posts"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {isUserPosts && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                component={Link}
                to="/posts/create"
              >
                Create Post
              </Button>
            )}
          </Box>
        </Box>
        <PostsList mode={mode} />
      </Box>
    </Container>
  );
};

export default Dashboard;
