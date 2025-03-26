import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, requiredUserType = null }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredUserType && currentUser.userType !== requiredUserType) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
