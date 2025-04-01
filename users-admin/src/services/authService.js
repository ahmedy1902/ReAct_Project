import axios from "axios";

const API_URL = "http://localhost:3004/api/users";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to add auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login user and store token in localStorage
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post("/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// Logout user and remove token from localStorage
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get current logged in user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Check if current user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

export default {
  login,
  logout,
  getCurrentUser,
  isAdmin,
  axiosInstance,
};
