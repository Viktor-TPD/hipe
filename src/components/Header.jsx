import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useAuthForm } from "../AuthFormContext";
import Button from "./buttons/Button.jsx";

function Header() {
  const { currentUser, logout } = useAuth();
  const { setFormType } = useAuthForm();

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
                // @todo Give both of these proper links
                <>
                  <NavLink to="/browse">
                    <Button variant="linkNavbar">Sök Företag</Button>
                  </NavLink>
                  <NavLink to="/dashboard">
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
