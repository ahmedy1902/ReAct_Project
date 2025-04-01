import axios from "axios";

const API_HOST = "localhost";
const API_PORT = 3004;

const api = axios.create({
  baseURL: `http://${API_HOST}:${API_PORT}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// Log the API server URL
console.log("API Server URL:", `http://${API_HOST}:${API_PORT}/api`);

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("Response received from:", response.config.url);
    return response;
  },
  (error) => {
    console.error("Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
