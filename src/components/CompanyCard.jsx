import React from "react";

export default function CompanyCard({ company }) {

    console.table(company);
  return (
      <div className="company-card">
      <div className="company-minimized">
        {company.profileImageUrl ? (
          <img 
            src={company.profileImageUrl} 
            alt={`${company.companyName}`} 
            className="company-image" 
          />
        ) : (
          <div className="company-image-placeholder">
            {company.companyName.charAt(0)}
          </div>
        )}
        <h3>{company.companyName}</h3>
      

      </div>

      <div className="company-content">
              <h3>{company.industry}</h3>

      <div className="company-description">
            <h4>Description</h4>
              <p>{company.desription}</p>
        </div>
      
      <div className="company-description">
            <h4>LIA-information</h4>
              <p>{company.internshipDetails}</p>
              <h4>Kontaktperson</h4>
              <p>{company.contactPerson.name}</p>
              <p>{company.contactPerson.email}</p>
        </div>
      
      <div className="company-links">
      <h4>Bifogade Länkar</h4>

        {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer">
            Hemsida
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