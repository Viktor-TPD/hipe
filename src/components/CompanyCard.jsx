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
    console.log("TJOHEJ" + company.contactPerson.name)
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
                {company.companyName ? company.companyName.charAt(0) : "?"}
              </div>
            )}
          </div>
          <h2 className="company-name">
            {company.companyName || "Company Name"}
          </h2>
        </div>

        {/* Right column - Company information */}
        <div className="company-right-column">
          <div className="company-name">
            <h4>Företagsnamn</h4>
            <h4>{company.companyName}</h4>
          </div>
          <div className="company-section company-focus">
            <h4>Företagsinriktning</h4>
            <p>{company.industry || "Not specified"}</p>
          </div>

          <div className="company-section company-description">
            <h4>Beskrivning</h4>
            <p>{company.description || "No description available"}</p>
          </div>

         
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
            <section className="company-internship-box">

              <div className="company-section company-internship">
                <h4>Liaplatser</h4>
                <p>{company.internshipDetails || "No information available"}</p>
              </div>
              <div className="company-section company-internship">
                <h4>Kontaktperson</h4>
                <p>{company.contactPerson.name || "No information available"}</p>
              </div>
              <div className="company-section company-internship">
                <h4>Mail</h4>
                <p>{company.contactPerson.email|| "No information available"}</p>
              </div>
            </section>

              


            </div>
          </div>
       
     
    </>
  );
}
