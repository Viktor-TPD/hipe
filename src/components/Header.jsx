import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

import Button from "./buttons/Button.jsx";

function Header() {
  const { currentUser, logout } = useAuth();

  function Logo() {
    return (
      <picture className="logo-item">
        <source
          media="(max-width: 768px)"
          srcSet="./../../public/assets/images/yrgo-logo-mobile.svg"
        />
        <img
          src="./../../public/assets/images/yrgo-logo-desktop.svg"
          alt="Logo"
        />
      </picture>
    );
  }

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Logo />
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

              <Button onClick={logout} variant="primary">
                Logga ut
              </Button>

              <Button variant="filter">Filter</Button>
              <Button variant="linkNavbar">Hem</Button>
            </>
          ) : (
            <>
              <Link to="/register">Registrering</Link>
              <Link to="/login">
                <Button variant="primary">Logga In</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
