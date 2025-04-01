import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Attempting registration with:", {
        ...userData,
        password: "[REDACTED]",
      });
      const response = await api.post("/users/register", userData);
      console.log("Registration response:", response.data);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Registration error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("Attempting login with:", {
        ...credentials,
        password: "[REDACTED]",
      });
      const response = await api.post("/users/login", credentials);
      console.log("Login response:", response.data);

      // Make sure we have a token in the response
      if (!response.data.token) {
        throw new Error("No token received");
      }

      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Login error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return rejectWithValue({
        message:
          error.response?.data?.message || "Login failed - please try again",
      });
    }
  }
);

// Load user data
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue({ message: "No token found", silent: true });
    }
    try {
      const response = await api.get("/users/me");
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt).toISOString(),
        stats: {
          totalPosts: response.data.stats?.totalPosts || 0,
          favoritePosts: response.data.stats?.favoritePosts || 0,
        },
        role: response.data.role || "user", // Make sure role is included
      };
    } catch (error) {
      localStorage.removeItem("token");
      throw error;
    }
  }
);

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
  role: null, // Add role to track admin status
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role; // Store the role
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.user.role = action.payload.role;
      // Remove isAdmin property and rely solely on role
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = {
          ...action.payload.user,
          role: action.payload.user.role, // Explicitly set role from response
        };
        state.isAuthenticated = true;
        // Store token in localStorage
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      // Load user cases
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.role = action.payload.role; // Store the role
        state.error = null;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        localStorage.removeItem("token");
      });
  },
});

export const { logout, clearError, setCredentials, setUser } =
  authSlice.actions;
export default authSlice.reducer;
