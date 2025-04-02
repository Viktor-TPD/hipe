import React from "react";

export default function CompanyCard({ company }) {

  return (
    <div className="company-card">
      <div className="company-minimized">
        {company.profileImageUrl ? (
          <img 
            src={company.profileImageUrl} 
            alt={`${company.name}`} 
            className="company-image" 
          />
        ) : (
          <div className="company-image-placeholder">
            {company.name.charAt(0)}
          </div>
        )}
        <h3>{company.name}</h3>
      

      </div>

      <div className="company-content">

      <div className="company-description">
            <h4>Description</h4>
              <p>{company.desription}</p>
        </div>
      
      <div className="company-links">
      <h4>Bifogade Länkar</h4>
      
        {company.linkedin && (
            <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}

        {company.portfolio && (
            <a href={company.portfolio} target="_blank" rel="noopener noreferrer">
            Portfolio
          </a>
        )}

        {/* {User.email && (
            <a href={User.email} target="_blank" rel="noopener noreferrer">
            Mail
          </a>
        )} */}

        {/* ska vi bara skriva ut mailen? och isf behöver vi göra en query för att få tag i den i junktion table eller kan vi kalla på user.mail? */}

        </div>
      </div>
    </div>
  );
}