import axios from "axios";

const registerAdmin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3004/api/users/register",
      {
        name: "Admin User",
        email: "admin@g.com",
        password: "admin123",
        passwordConfirm: "admin123",
        role: "admin",
      }
    );
    console.log("Admin user created successfully:", response.data);
  } catch (error) {
    console.error(
      "Error creating admin user:",
      error.response?.data || error.message
    );
  }
};

registerAdmin();
