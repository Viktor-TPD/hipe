import React, { useState, useEffect } from "react";
import { useAuth } from "./../AuthContext.jsx";
import { useNotification } from "./../NotificationContext.jsx";
import { API_BASE_URL } from "./../config";
import "../styles/card.css";
import "../styles/imageUpload.css";

export default function StudentCard({
  student,
  onClose,
  inBrowseView = false,
  cardId,
  isActive = false,
  onActivate,
}) {
  const { currentUser } = useAuth();
  const [minimized, setMinimized] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const { showNotification } = useNotification();

  // Fetch company profile when component mounts
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (currentUser?.userType === "company") {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${API_BASE_URL}/api/v1/companies/${currentUser.userId}`
          );

          if (!response.ok) {
            console.error(
              "Failed to fetch company profile:",
              await response.text()
            );
            return;
          }

          const result = await response.json();

          if (result.success && result.data) {
            setCompanyProfile(result.data);
            console.log("Company profile loaded:", result.data._id);
          }
        } catch (error) {
          console.error("Error fetching company profile:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCompanyProfile();
  }, [currentUser]);

  // Check if student is already liked once we have both student and company profile
  useEffect(() => {
    const checkExistingLike = async () => {
      if (!student?._id || !companyProfile?._id) return;

      try {
        setIsLoading(true);

        // Build URL with explicit query parameters
        const url = new URL(`${API_BASE_URL}/api/v1/likes`);
        url.searchParams.append("studentId", student._id);
        url.searchParams.append("companyId", companyProfile._id);

        console.log("Checking like status:", url.toString());
        console.log("Student ID:", student._id);
        console.log("Company ID:", companyProfile._id);

        const response = await fetch(url);

        if (!response.ok) {
          // Handle different status codes differently
          if (response.status === 404) {
            // API endpoint not found - might need to check routes
            console.warn("API endpoint not found:", await response.text());
            setIsSaved(false);
          } else {
            // Other errors
            const errorData = await response.json();
            console.error("Error response:", errorData);
            setIsSaved(false);
          }
          return;
        }

        const result = await response.json();
        console.log("Like status check result:", result);

        // Check if there are likes in the response
        setIsSaved(result.count > 0);
      } catch (error) {
        console.error("Error checking like status:", error);
        setIsSaved(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (student?._id && companyProfile?._id) {
      checkExistingLike();
    }
  }, [student, companyProfile]);

  // Handle save/like button click
  const handleSaveClick = async () => {
    if (isLoading) return; // Prevent multiple clicks

    // Validate prerequisites
    if (!currentUser?.userType === "company") {
      showNotification("Only companies can save students", "error");
      return;
    }

    if (!companyProfile) {
      showNotification("Please complete your company profile first", "error");
      return;
    }

    if (!student?._id) {
      showNotification("Invalid student profile", "error");
      return;
    }

    try {
      setIsLoading(true);

      // Ensure we're sending valid IDs by logging them first
      console.log("Sending like request with:", {
        studentId: student._id,
        companyId: companyProfile._id,
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: student._id,
          companyId: companyProfile._id,
        }),
      });

      // Log the response status and get the response text
      console.log("Response status:", response.status);
      const responseText = await response.text();

      // Try to parse the response as JSON, or use the raw text if parsing fails
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error("Invalid server response");
      }

      console.log("Full response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to update saved status");
      }

      if (result.success) {
        setIsSaved(result.action === "created");
        showNotification(
          result.action === "created"
            ? "Student saved successfully"
            : "Student removed from saved list",
          result.action === "created" ? "success" : "info"
        );
      } else {
        throw new Error(result.message || "Failed to update saved status");
      }
    } catch (error) {
      console.error("Error saving/unsaving student:", error);
      showNotification(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine course name from courseId
  const getCourseName = (courseId) => {
    return courseId === "dd"
      ? "Digital Designer"
      : courseId === "wu"
      ? "Webbutvecklare"
      : "Unknown";
  };

  // Handle minimize/maximize button click
  const handleMinimizeClick = (e) => {
    if (onClose) {
      onClose();
    } else if (onActivate) {
      // Using the parent component's state management
      onActivate(cardId, !isActive);
    }
  };

  // If student is undefined or null, show a placeholder or return null
  if (!student) {
    return <div className="student-card empty">No student data available</div>;
  }

  // Render course-specific information based on student's course
  const renderCourseSpecificInfo = () => {
    if (student.courseId === "dd") {
      return (
        <>
          <div className="student-section student-specializations">
            <h4>Inriktning</h4>
            <div className="tags">
              {student.specialization &&
                student.specialization.map((spec, index) => (
                  <span key={index} className="tag">
                    {spec}
                  </span>
                ))}
            </div>
          </div>
          <div className="student-section student-software">
            <h4>Design Program</h4>
            <div className="tags">
              {student.software &&
                student.software.map((sw, index) => (
                  <span key={index} className="tag">
                    {sw}
                  </span>
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
              {student.languages &&
                student.languages.map((lang, index) => (
                  <span key={index} className="tag">
                    {lang}
                  </span>
                ))}
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className={`student-card ${isActive ? "student-card-maximized" : ""}`}>
      {/* Minimize/Maximize button */}
      <button
        className="minimize-button"
        onClick={handleMinimizeClick}
        title={!isActive ? "Maximera" : "Minska"}
      >
        <p>{!isActive ? "Maximera" : "Minska"}</p>
        <img
          src={
            !isActive
              ? "../public/assets/images/maximize.svg"
              : "../public/assets/images/minimize.svg"
          }
          alt=""
        />
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
        {currentUser?.userType === "company" && (
          <button
            className={`save-button ${isSaved ? "saved" : ""}`}
            onClick={handleSaveClick}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isSaved ? "red" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {isLoading ? "Sparar..." : isSaved ? "Sparad" : "Spara kandidat"}
          </button>
        )}
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
              <a
                href={student.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="student-link"
              >
                <img src="../public/assets/images/linkedin.svg" alt="" />
                LinkedIn
              </a>
            )}

            {student.portfolio && (
              <a
                href={student.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="student-link"
              >
                <img src="../public/assets/images/portfolio.svg" alt="" />
                Portfolio
              </a>
            )}

            {student.userId?.email && (
              <a
                href={`mailto:${student.userId.email}`}
                className="student-link"
              >
                <img src="../public/assets/images/mail.svg" alt="" />
                {student.userId.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
