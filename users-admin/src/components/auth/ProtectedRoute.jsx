import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAdmin } from "../../services/authService";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    // If not admin, redirect to login
    if (!isAdmin()) {
      navigate("/login");
    }
  }, [navigate]);

  // Prevent rendering children if not admin
  if (!isAdmin()) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
