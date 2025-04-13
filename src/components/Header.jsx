import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useAuthForm } from "../AuthFormContext";
import Button from "./buttons/Button.jsx";

function Header() {
  const { currentUser, logout } = useAuth();
  const { setFormType } = useAuthForm();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleFormTypeChange = (type) => {
    setFormType(type);

    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getInitial = () => {
    return currentUser && currentUser.email
      ? currentUser.email.charAt(0).toUpperCase()
      : "?";
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Logo />
        </div>

        {currentUser && (
          <div className="nav-links desktop-only">
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              <Button variant="linkNavbar">Event</Button>
            </NavLink>
            {currentUser.userType === "student" && (
              <>
                <NavLink to="/browse" onClick={() => setMenuOpen(false)}>
                  <Button variant="linkNavbar">Sök Företag</Button>
                </NavLink>
                <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="linkNavbar">Matchningar</Button>
                </NavLink>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                  <Button variant="linkNavbar">Min Profil</Button>
                </NavLink>
              </>
            )}
            {currentUser.userType === "company" && (
              <>
                <NavLink to="/browse" onClick={() => setMenuOpen(false)}>
                  <Button variant="linkNavbar">Sök Kandidater</Button>
                </NavLink>
                <NavLink to="/favorites" onClick={() => setMenuOpen(false)}>
                  <Button variant="linkNavbar">Sparade Kandidater</Button>
                </NavLink>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                  <Button variant="linkNavbar">Min Profil</Button>
                </NavLink>
              </>
            )}
          </div>
        )}

        {currentUser && (
          <span
            className="logout-text desktop-only"
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
          >
            Logga ut
          </span>
        )}

        <button
          className={`hamburger-menu ${menuOpen ? "menu-open" : ""}`}
          onClick={toggleMenu}
        >
          <span>Meny</span>
          <div className="hamburger-icon">
            <span className={`line ${menuOpen ? "open" : ""}`}></span>
            <span className={`line ${menuOpen ? "open" : ""}`}></span>
            <span className={`line ${menuOpen ? "open" : ""}`}></span>
          </div>
        </button>

        <nav className={`main-nav ${menuOpen ? "mobile-open" : ""}`}>
          {currentUser && (
            <div className="mobile-menu-header">
              <div className="user-profile-section">
                <div className="user-avatar">
                  {currentUser.profileImageUrl ? (
                    <img src={currentUser.profileImageUrl} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">{getInitial()}</div>
                  )}
                </div>
                <div className="user-info">
                  <span>{currentUser.email}</span>
                </div>
              </div>
              <button
                className="mobile-logout-btn"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Logga ut
              </button>
            </div>
          )}

          <div className="nav-links-container">
            {currentUser ? null : (
              <>
                <Button
                  variant="linkNavbar"
                  onClick={() => {
                    handleFormTypeChange("register");
                    setMenuOpen(false);
                  }}
                >
                  Registrering
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleFormTypeChange("login");
                    setMenuOpen(false);
                  }}
                >
                  Logga In
                </Button>
              </>
            )}
          </div>

          <Button
            variant="filter"
            className="mobile-close-btn"
            onClick={toggleMenu}
          >
            Stäng
          </Button>
        </nav>
      </div>

      {menuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
    </header>
  );
}

export default Header;
