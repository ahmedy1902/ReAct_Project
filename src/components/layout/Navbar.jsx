import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import PublicIcon from "@mui/icons-material/Public";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    {
      path: "/dashboard",
      icon: <ArticleIcon />,
      label: "My Posts",
    },
    {
      path: "/all-posts",
      icon: <PublicIcon />,
      label: "All Posts",
    },
    { path: "/profile", icon: <PersonIcon />, label: "Profile" },
  ];

  // Add user management link for admin users
  if (user?.role === "admin") {
    navigationItems.push({
      path: "/users",
      icon: <PeopleIcon />,
      label: "Users",
    });
  }

  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === "admin";
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          width: "100%",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "800px", margin: "0 auto", p: 2 }}>
          {/* Logo */}
          <Typography
            variant="h3"
            align="center"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              mb: 3,
              mt: 2,
            }}
          >
            Posts App
          </Typography>

          {/* Navigation */}
          <Toolbar sx={{ justifyContent: "center", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  color="primary"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    bgcolor: isActive(item.path)
                      ? "primary.light"
                      : "transparent",
                    color: isActive(item.path) ? "white" : "primary.main",
                    "&:hover": {
                      bgcolor: isActive(item.path)
                        ? "primary.light"
                        : "primary.lighter",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  ml: 2,
                  bgcolor: "error.light",
                  color: "white",
                  "&:hover": {
                    bgcolor: "error.main",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
    </Box>
  );
};

export default Navbar;
