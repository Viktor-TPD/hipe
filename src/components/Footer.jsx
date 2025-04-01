import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Hipe</h3>
          <p>Connecting students and companies</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>About</h4>
          <p>
            Hipe is a platform that connects students with companies for
            internship opportunities.
          </p>
        </div>

        <div className="footer-copyright">
          <p>&copy; {currentYear} Hipe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
