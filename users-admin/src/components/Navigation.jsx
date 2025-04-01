import { Link } from "react-router-dom";
import { isAdmin, getCurrentUser, logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">User Management System</Link>
      </div>

      <div className="navbar-menu">
        {user ? (
          <>
            <span className="user-info">
              Welcome, {user.name} ({user.role})
            </span>
            {isAdmin() && (
              <Link to="/admin/users" className="nav-link">
                Manage Users
              </Link>
            )}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
