import React, { useState } from 'react';
import { useAuth } from './../AuthContext.jsx'
import '../styles/card.css';
import '../styles/imageUpload.css';

export default function StudentCard({ student, onClose }) {
  // State for minimize/maximize
  const [minimized, setMinimized] = useState(false);
  const {currentUser} = useAuth();
  
  // Determine course name from courseId
  const getCourseName = (courseId) => {
    return courseId === "dd" ? "Digital Designer" : courseId === "wu" ? "Webbutvecklare" : "Unknown";
  };

  // Handle save/like button click
  const handleSaveClick = () => {
    // Add your save functionality here
    console.log(`Saved student: ${student.name}`);
  };
  
  // Handle minimize button click
  const handleMinimizeClick = () => {
    if (onClose) {
      onClose();
    } else {
      setMinimized(!minimized);
      console.log(`${minimized ? 'Maximized' : 'Minimized'} student card: ${student.name}`);
    }
  };

  // Render course-specific information based on student's course
  const renderCourseSpecificInfo = () => {
    if (student.courseId === "dd") {
      return (
        <>
          <div className="student-section student-specializations">
            <h4>Inriktning</h4>
            <div className="tags">
              {student.specialization && student.specialization.map((spec, index) => (
                <span key={index} className="tag">{spec}</span>
              ))}
            </div>
          </div>
          <div className="student-section student-software">
            <h4>Design Program</h4>
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
          <div className="student-section student-stack">
            <h4>Stack</h4>
            <div className="tags">
              <span className="tag">{student.stack}</span>
            </div>
          </div>
          <div className="student-section student-languages">
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
    <>
    <div className="student-card" data-course={student.courseId}>
      {/* Minimize button */}
      <button className="minimize-button" onClick={handleMinimizeClick} title="Minska">
        <p>Minska </p>
      <img src="../public/assets/images/minimize.svg" alt="" />
      </button>

      {/* Left column - Profile image and name */}
      <div className="student-left-column">
        <div className="image-preview">
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
        </div>
        <h2 className="student-name">{student.name}</h2>
        <h3 className="student-course">{getCourseName(student.courseId)}</h3>

      {/* Save/like button */}
      <button className="save-button" onClick={handleSaveClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        Spara kandidat
      </button>

      </div>
      

      {/* Right column - Student information */}
      <div className="student-right-column">
        {student.description && (
            <div className="student-section student-description">
            <h4>Beskrivning</h4>
            <p>{student.description}</p>
          </div>
        )}
        
        {renderCourseSpecificInfo()}
        
        <div className="student-section student-links">
          <h4>Bifogade Länkar</h4>
          <div className="link-container">
            {student.linkedin && (
                <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="student-link">
                <img src="../public/assets/images/linkedin.svg" alt="" />
                My.linkedin
              </a>
            )}
            
            {student.portfolio && (
                <a href={student.portfolio} target="_blank" rel="noopener noreferrer" className="student-link">
                <img src="../public/assets/images/portfolio.svg" alt="" />
                Portfolio.com
              </a>
            )}
            
            {currentUser.email && (
                <a href={`mailto:${currentUser.email}`} className="student-link">
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