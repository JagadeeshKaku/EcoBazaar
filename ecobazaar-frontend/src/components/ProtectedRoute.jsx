import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  
  // Get and clean the role (handles ROLE_ADMIN -> ADMIN)
  const rawRole = localStorage.getItem("role") || "";
  const userRole = rawRole.replace("ROLE_", "").toUpperCase().trim();

  // 1. If not logged in, go to login
  if (!token) {
    return <Navigate to="/" />;
  }

  // 2. If a specific role is required, check it
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If they aren't allowed (e.g. User trying to see Admin), send to products
    return <Navigate to="/products" />;
  }

  return children;
}

export default ProtectedRoute;
