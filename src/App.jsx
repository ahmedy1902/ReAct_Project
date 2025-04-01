import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { loadUser } from "./features/auth/authSlice";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
  Container,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Box from "@mui/material/Box";
import mineBg from "./assets/mine.jpg"; // أضف هذا الاستيراد في بداية الملف
import { Link } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import UserManagement from "./components/UserManagement";

// Components
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import CreatePost from "./components/posts/CreatePost";
import UserProfile from "./components/profile/UserProfile";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/routing/PrivateRoute";
import UserList from "./components/users/UserList";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
      light: "#4dabf5",
      dark: "#1769aa",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "90% !important",
          width: "90%",
          margin: "0 auto",
          padding: "24px",
          "@media (min-width: 1200px)": {
            maxWidth: "90% !important",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

// Root component that provides store to the app
const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

const AuthProvider = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        await dispatch(loadUser()).unwrap();
      } catch (err) {
        localStorage.removeItem("token");
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (checking) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
        backgroundImage: `url(${mineBg})`, // استخدم المتغير المستورد هنا
        backgroundSize: "cover",
        backgroundPosition: "center 15%", // تم تعديل هذا السطر لتحريك الصورة لأسفل
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        overflow: "auto",
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.6)", // تم تغيير القيمة من 0.85 إلى 0.6
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "90%",
          maxWidth: "90%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isAuthenticated && <Navbar />}
        <Box
          sx={{
            width: "100%",
            maxWidth: "90%",
            margin: "0 auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Container>
            <Routes>
              <Route
                path="/login"
                element={
                  !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
                }
              />
              <Route
                path="/register"
                element={
                  !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
                }
              />
              {isAuthenticated && (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/all-posts" element={<Dashboard mode="all" />} />
                  <Route path="/posts/create" element={<CreatePost />} />
                  <Route path="/profile" element={<UserProfile />} />
                  {user?.role === "admin" && (
                    <Route path="/users" element={<UserManagement />} />
                  )}
                </>
              )}
              <Route
                path="*"
                element={
                  <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
                }
              />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
