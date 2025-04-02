import React from "react";

export default function StudentCard({ student }) {
  // Visa olika innehåll beroende på studentens utbildning
  const renderSpecificInfo = () => {
    if (student.courseId === "dd") {
      return (
        <>
          <div className="student-specializations">
            <h4>Inriktningar</h4>
            <div className="tags">
              {student.specialization && student.specialization.map((spec, index) => (
                <span key={index} className="tag">{spec}</span>
              ))}
            </div>
          </div>
          <div className="student-software">
            <h4>Designprogram</h4>
            <div className="tags">
              {student.software && student.software.map((sw, index) => (
                <span key={index} className="tag">{sw}</span>
              ))}
            </div>
          </div>
        </>
      );
    } else if (student.courseId === "wu") {
      return (
        <>
          <div className="student-stack">
            <h4>Stack</h4>
            <span className="tag">{student.stack}</span>
          </div>
          <div className="student-languages">
            <h4>Språk/Ramverk</h4>
            <div className="tags">
              {student.languages && student.languages.map((lang, index) => (
                <span key={index} className="tag">{lang}</span>
              ))}
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="student-card">
      <div className="student-minimized">
        {student.profileImageUrl ? (
          <img 
            src={student.profileImageUrl} 
            alt={`${student.name}`} 
            className="student-image" 
          />
        ) : (
          <div className="student-image-placeholder">
            {student.name.charAt(0)}
          </div>
        )}
        <h3>{student.name}</h3>
      
      <div className="student-course">
        {student.courseId === "dd" ? "Digital Design" : "Webbutveckling"}
      </div>

      {/* Här ska finnas plas för like knapp */}
      </div>

      <div className="student-content">

      <div className="student-description">
            <h4>Description</h4>
              <p>{student.desription}</p>  
        </div>

      {renderSpecificInfo()}

      
      <div className="student-links">
      <h4>Bifogade Länkar</h4>
      
        {student.linkedin && (
            <a href={student.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}

        {student.portfolio && (
            <a href={student.portfolio} target="_blank" rel="noopener noreferrer">
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