import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../../services/userService";
import { getCurrentUser, logout } from "../../services/authService";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current admin data
        const adminData = await getCurrentUser();
        setAdmin(adminData);

        // Fetch users list
        const usersData = await getAllUsers();
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error loading data");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Function to delete a user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user._id !== userId));
        setMessage("User deleted successfully");
        setTimeout(() => setMessage(""), 3000);
      } catch (err) {
        setError(err.message || "Failed to delete user");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Function to update user role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      // Update users state locally
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      setMessage(
        `User role changed to ${
          newRole === "admin" ? "Administrator" : "Regular User"
        } successfully`
      );
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update user role");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>User Management</h2>
        {admin && (
          <div className="admin-info">
            <span>Welcome, {admin.name}</span>
            <span>({admin.email})</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  disabled={admin?._id === user._id} // Disable role change for current admin
                  className="role-select"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user._id)}
                  disabled={admin?._id === user._id} // Disable deletion for current admin
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
