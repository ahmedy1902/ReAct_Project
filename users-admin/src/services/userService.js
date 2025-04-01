import authService from "./authService";

const API_URL = "http://localhost:3004/api/users";
const { axiosInstance } = authService;

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data.data.users;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data.data.user;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user" };
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.patch(`/${id}`, userData);
    return response.data.data.user;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update user" };
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    await axiosInstance.delete(`/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete user" };
  }
};

// Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const response = await axiosInstance.patch(`/${userId}`, { role });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
};
