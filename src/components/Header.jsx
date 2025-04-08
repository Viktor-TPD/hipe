import { NavLink } from "react-router-dom";
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
              <NavLink to="/">
                <Button variant="linkNavbar">Event</Button>
              </NavLink>
              {currentUser.userType === "student" && (
                <>
                  <NavLink to="/browse">
                    <Button variant="linkNavbar">Sök Företag</Button>
                  </NavLink>
                  {/* @todo This needs the correct link */}
                  <NavLink to="/">
                    <Button variant="linkNavbar">Matchningar</Button>
                  </NavLink>
                  <NavLink to="/profile">
                    <Button variant="linkNavbar">Min Profil</Button>
                  </NavLink>
                </>
              )}

              {currentUser.userType === "company" && (
                <>
                  <NavLink to="/browse">
                    <Button variant="linkNavbar">Sök Kandidater</Button>
                  </NavLink>
                  <NavLink to="/favorites">
                    <Button variant="linkNavbar">Sparade Kandidater</Button>
                  </NavLink>
                  <NavLink to="/profile">
                    <Button variant="linkNavbar">Min Profil</Button>
                  </NavLink>
                </>
              )}
            </>
          ) : (
            <>
              <NavLink to="/register">Registrering</NavLink>
              <NavLink to="/login">
                <Button variant="primary">Logga In</Button>
              </NavLink>
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
