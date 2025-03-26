import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function UnauthorizedPage() {
  const { currentUser } = useAuth();

  return (
    <div className="unauthorized-container">
      <h1>Unauthorized Access</h1>
      <p>Sorry, you don't have permission to view this page.</p>

      {currentUser && (
        <p>
          You're currently logged in as a {currentUser.userType}. This page may
          require different permissions.
        </p>
      )}

      <div className="action-buttons">
        <Link to="/dashboard" className="button">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
