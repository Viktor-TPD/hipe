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
              <Link to="/">
                <Button variant="linkNavbar">Event</Button>
              </Link>
              {currentUser.userType === "student" && (
                <>
                  <Link to="/browse-companies">
                    <Button variant="linkNavbar">Sök Företag</Button>
                  </Link>
                  {/* @todo This needs the correct link */}
                  <Link to="/">
                    <Button variant="linkNavbar">Matchningar</Button>
                  </Link>
                  <Link to="/create-studentProfile">
                    <Button variant="linkNavbar">Min Profil</Button>
                  </Link>
                </>
              )}

              {currentUser.userType === "company" && (
                <>
                  <Link to="/browse-students">
                    <Button variant="linkNavbar">Sök Kandidater</Button>
                  </Link>
                  <Link to="/favourite-students">
                    <Button variant="linkNavbar">Sparade Kandidater</Button>
                  </Link>
                  <Link to="/create-companyProfile">
                    <Button variant="linkNavbar">Min Profil</Button>
                  </Link>
                </>
              )}
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

        {currentUser && (
          <Button onClick={logout} variant="linkNavbar">
            Logga ut
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
