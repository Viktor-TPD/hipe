import React, { useState } from "react";
import { useAuth } from "./../AuthContext.jsx";
import "../styles/card.css";
import "../styles/imageUpload.css";

export default function CompanyCard({ company = {}, onClose }) {
  // Provide a default empty object if company is undefined
  const [minimized, setMinimized] = useState(false);
  const { currentUser } = useAuth();

  // Handle minimize button click
  const handleMinimizeClick = () => {
    if (onClose) {
      onClose();
    } else {
      setMinimized(!minimized);
      console.log(
        `${minimized ? "Maximized" : "Minimized"} company card: ${
          company?.name || "Unknown"
        }`
      );
    }
  };

  // If company is undefined or null, show a placeholder or return null
  if (!company) {
    return <div className="company-card empty">No company data available</div>;
  }

  return (
    <>
      <div className="company-card">
        {/* Minimize button */}
        <button
          className="minimize-button"
          onClick={handleMinimizeClick}
          title="Minska"
        >
          <p>Minska </p>
          <img src="../public/assets/images/minimize.svg" alt="" />
        </button>

        {/* Left column - Profile image and name */}
        <div className="company-left-column">
          <div className="image-preview">
            {company.profileImageUrl ? (
              <img
                src={company.profileImageUrl}
                alt={`${company.name || "Company"}`}
                className="company-image"
              />
            ) : (
              <div className="company-image-placeholder">
                {company.name ? company.name.charAt(0) : "?"}
              </div>
            )}
          </div>
          <h2 className="company-name">{company.name || "Company Name"}</h2>
        </div>

        {/* Right column - Company information */}
        <div className="company-right-column">
          <div className="company-section company-focus">
            <h4>Företagsinriktning</h4>
            <p>{company.industry || "Not specified"}</p>
          </div>

          <div className="company-section company-description">
            <h4>Beskrivning</h4>
            <p>{company.description || "No description available"}</p>
          </div>

          <div className="company-section company-positions">
            <h4>Liaplatser</h4>
            <p>{company.internshipDetails || "No information available"}</p>
          </div>

          <div className="company-section company-links">
            <h4>Bifogade Länkar</h4>
            <div className="link-container">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="company-link"
                >
                  <img src="../public/assets/images/portfolio.svg" alt="" />
                  {company.website}
                </a>
              )}

              {currentUser?.email && (
                <a
                  href={`mailto:${currentUser.email}`}
                  className="company-link"
                >
                  <img src="../public/assets/images/mail.svg" alt="" />
                  {currentUser.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
