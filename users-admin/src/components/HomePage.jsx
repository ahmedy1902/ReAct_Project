import { useNavigate } from "react-router-dom";
import { isAdmin } from "../services/authService";

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleAdminClick = () => {
    navigate("/admin/users");
  };

  return (
    <div className="home-container">
      <h1>User Management System</h1>
      <p>
        Welcome to the User Management System. This system allows administrators
        to manage users registered in the database.
      </p>

      <div className="home-buttons">
        {isAdmin() ? (
          <button onClick={handleAdminClick} className="btn btn-primary">
            Go to Admin Dashboard
          </button>
        ) : (
          <button onClick={handleLoginClick} className="btn btn-primary">
            Admin Login
          </button>
        )}
      </div>
    </div>
  );
}

export default HomePage;
