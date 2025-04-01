import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../features/auth/authSlice";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import StarIcon from "@mui/icons-material/Star";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // تحديث بيانات المستخدم عند فتح الصفحة
    dispatch(loadUser());
  }, [dispatch]);

  const StatsCard = ({ title, value, icon }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" color="primary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Username
          </Typography>
          <Typography variant="h6">{user.username}</Typography>

          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
            Email
          </Typography>
          <Typography variant="h6">{user.email}</Typography>

          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
            Member Since
          </Typography>
          <Typography variant="h6">
            {new Date(user.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ mb: 2 }}>
          Statistics
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <StatsCard
              title="Total Posts"
              value={user?.stats?.totalPosts ?? 0}
              icon={<PostAddIcon color="primary" />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StatsCard
              title="Favorite Posts"
              value={user?.stats?.favoritePosts ?? 0}
              icon={<StarIcon color="primary" />}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile;
