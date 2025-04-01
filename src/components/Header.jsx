import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>Hipe</h1>
          </Link>
        </div>

        <nav className="main-nav">
          {currentUser ? (
            <>
              <Link to="/dashboard">Dashboard</Link>

              {currentUser.userType === "student" && (
                <>
                  <Link to="/browse-companies">Browse Companies</Link>
                </>
              )}

              {currentUser.userType === "company" && (
                <>
                  <Link to="/browse-students">Browse Students</Link>
                  <Link to="/favourite-students">Favorites</Link>
                </>
              )}

              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
