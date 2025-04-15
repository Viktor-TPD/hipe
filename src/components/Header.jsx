import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useAuthForm } from "../AuthFormContext";
import { useUserProfile } from "./hooks/useProfile";
import Button from "./buttons/Button.jsx";

import "./../styles/a11y.css";
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
          <>
            <div className="nav-links desktop-only">
              <NavLink to="/" onClick={() => setMenuOpen(false)}>
                <Button variant="linkNavbar" className="focus-visible-only">
                  Event
                </Button>
              </NavLink>
              {currentUser.userType === "student" && (
                <>
                  <NavLink to="/browse" onClick={() => setMenuOpen(false)}>
                    <Button variant="linkNavbar" className="focus-visible-only">
                      Sök Företag
                    </Button>
                  </NavLink>

                  <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                    <Button variant="linkNavbar" className="focus-visible-only">
                      Min Profil
                    </Button>
                  </NavLink>
                </>
              )}
              {currentUser.userType === "company" && (
                <>
                  <NavLink to="/browse" onClick={() => setMenuOpen(false)}>
                    <Button variant="linkNavbar" className="focus-visible-only">
                      Sök Kandidater
                    </Button>
                  </NavLink>
                  <NavLink to="/favorites" onClick={() => setMenuOpen(false)}>
                    <Button variant="linkNavbar" className="focus-visible-only">
                      Sparade Kandidater
                    </Button>
                  </NavLink>
                  <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                    <Button variant="linkNavbar" className="focus-visible-only">
                      Min Profil
                    </Button>
                  </NavLink>
                </>
              )}
            </div>

            <span
              className="logout-text desktop-only focus-visible-only"
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
          <div className="auth-buttons">
            <Button
              variant="linkNavbar"
              onClick={() => handleFormTypeChange("register")}
              className="focus-visible-only"
            >
              Registrering
            </Button>
            <Button
              variant="primary"
              onClick={() => handleFormTypeChange("login")}
              className="focus-visible-only"
            >
              Logga In
            </Button>
          </div>
        )}

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
