import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useAuthForm } from "../AuthFormContext";
import { useUserProfile } from "./hooks/useProfile";
import Button from "./buttons/Button.jsx";

import "./../styles/ac11y.css";
import "./../styles/styles.css";

function Header() {
  const { currentUser, logout } = useAuth();
  const { setFormType } = useAuthForm();
  const { profileData } = useUserProfile();
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
        document.body.style.overflow = "";
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

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
    return profileData && profileData.email
      ? profileData.email.charAt(0).toUpperCase()
      : "?";
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Logo />
        </div>

        {currentUser ? (
          // User is logged in
          <>
            <div className="nav-links desktop-only">
              <NavLink to="/" onClick={() => setMenuOpen(false)}>
                <Button variant="linkNavbar">Event</Button>
              </NavLink>
              {currentUser.userType === "student" && (
                <>
                  <NavLink to="/browse" onClick={() => setMenuOpen(false)}>
                    <Button variant="linkNavbar">Sök Företag</Button>
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

            <span
              className="logout-text desktop-only"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              tabIndex="0"
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  logout();
                  setMenuOpen(false);
                }
              }}
            >
              Logga ut
            </span>

            {/* Only show hamburger menu when logged in */}
            <button
              className={`hamburger-menu ${menuOpen ? "hidden" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span>Meny</span>
              <div className="hamburger-icon">
                <span className={`line ${menuOpen ? "open" : ""}`}></span>
                <span className={`line ${menuOpen ? "open" : ""}`}></span>
                <span className={`line ${menuOpen ? "open" : ""}`}></span>
              </div>
            </button>
          </>
        ) : (
          // User is NOT logged in - always show auth buttons regardless of screen size
          <div className="auth-buttons">
            <Button
              variant="linkNavbar"
              onClick={() => handleFormTypeChange("register")}
            >
              Registrering
            </Button>
            <Button
              variant="primary"
              onClick={() => handleFormTypeChange("login")}
            >
              Logga In
            </Button>
          </div>
        )}

        {/* Mobile navigation menu - only for logged in users */}
        {currentUser && (
          <nav className={`main-nav ${menuOpen ? "mobile-open" : ""}`}>
            <div className="mobile-menu-header">
              <div className="user-profile-section">
                <div className="user-avatar">
                  {profileData?.profileImageUrl ? (
                    <img src={profileData.profileImageUrl} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">{getInitial()}</div>
                  )}
                </div>
                <div className="user-info">
                  <span>{profileData?.displayName || currentUser.email}</span>
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

            <div className="nav-links-container">
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

            <Button
              variant="filter"
              className="mobile-close-btn"
              onClick={toggleMenu}
            >
              Stäng
            </Button>
          </nav>
        )}
      </div>

      {menuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
    </header>
  );
}

export default Header;
