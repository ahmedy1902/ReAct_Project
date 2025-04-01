import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, clearError } from "../../features/auth/authSlice";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Alert,
  Paper,
} from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const validateField = (name, value) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          fieldErrors.name = "Name is required";
        } else {
          delete fieldErrors.name;
        }
        break;
      case "username":
        if (!value.trim()) {
          fieldErrors.username = "Username is required";
        } else {
          delete fieldErrors.username;
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          fieldErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          fieldErrors.email = "Please enter a valid email address";
        } else {
          delete fieldErrors.email;
        }
        break;
      case "password":
        if (!value) {
          fieldErrors.password = "Password is required";
        } else if (value.length < 8) {
          fieldErrors.password = "Password must be at least 8 characters";
        } else if (
          formData.passwordConfirm &&
          value !== formData.passwordConfirm
        ) {
          fieldErrors.password = "Passwords do not match";
        } else {
          delete fieldErrors.password;
        }
        break;
      case "passwordConfirm":
        if (!value) {
          fieldErrors.passwordConfirm = "Password confirmation is required";
        } else if (value !== formData.password) {
          fieldErrors.passwordConfirm = "Passwords do not match";
        } else {
          delete fieldErrors.passwordConfirm;
        }
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    if (isValid) {
      dispatch(register(formData));
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            autoFocus
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="passwordConfirm"
            label="Confirm Password"
            type="password"
            id="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            error={!!errors.passwordConfirm}
            helperText={errors.passwordConfirm}
            dir="ltr"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          <Button fullWidth variant="text" onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
