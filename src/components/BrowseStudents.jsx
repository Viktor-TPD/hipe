import { useState, useEffect, useCallback } from "react";
import StudentCard from "./StudentCard";
import { specializations, softwares, languages, stacks } from "./FormData";
import { API_BASE_URL } from "./../config";
import Button from "./buttons/Button.jsx";
import "./../styles/browse.css";
import "./../styles/filter.css";

export default function BrowseStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCardId, setActiveCardId] = useState(null);
  const [showFilters, setShowFilters] = useState(false); // Added missing state

  // Filter states
  const [courseId, setCourseId] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedSoftwares, setSelectedSoftwares] = useState([]);
  const [selectedStack, setSelectedStack] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  // Fetch all students when component loads
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/students/`);

        if (!response.ok) {
          throw new Error("Failed to fetch student profiles");
        }

        const responseData = await response.json();

        // Check if the response has the expected structure
        if (!responseData.success || !responseData.data) {
          throw new Error("Invalid response format from server");
        }

        // Extract student data from the response
        const studentData = responseData.data;

        setStudents(studentData);
        setFilteredStudents(studentData);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load student profiles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Memoized filter function to prevent unnecessary re-renders
  const applyFilters = useCallback(() => {
    const results = students.filter((student) => {
      // Filter by course if selected
      if (courseId && student.courseId !== courseId) {
        return false;
      }

      // Filter by specialization if selected and course is Digital Design (or no course filter)
      if (
        selectedSpecializations.length > 0 &&
        (courseId === "" || courseId === "dd") &&
        (!student.specialization ||
          !selectedSpecializations.some((spec) =>
            student.specialization.includes(spec)
          ))
      ) {
        return false;
      }

      // Filter by software if selected and course is Digital Design (or no course filter)
      if (
        selectedSoftwares.length > 0 &&
        (courseId === "" || courseId === "dd") &&
        (!student.software ||
          !selectedSoftwares.some((sw) => student.software.includes(sw)))
      ) {
        return false;
      }

      // Filter by stack if selected and course is Web Development (or no course filter)
      if (
        selectedStack &&
        (courseId === "" || courseId === "wu") &&
        student.stack !== selectedStack
      ) {
        return false;
      }

      // Filter by languages if selected and course is Web Development (or no course filter)
      if (
        selectedLanguages.length > 0 &&
        (courseId === "" || courseId === "wu") &&
        (!student.languages ||
          !selectedLanguages.some((lang) => student.languages.includes(lang)))
      ) {
        return false;
      }

      return true;
    });

    setFilteredStudents(results);
  }, [
    courseId,
    selectedSpecializations,
    selectedSoftwares,
    selectedStack,
    selectedLanguages,
    students,
  ]);

  // Update filtering when filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle card activation/deactivation
  const handleCardActivation = (cardId, isActive) => {
    setActiveCardId(isActive ? cardId : null);

    // Lock body scrolling when a card is maximized
    document.body.style.overflow = isActive ? "hidden" : "";
  };

  // Handle overlay click
  const handleOverlayClick = () => {
    setActiveCardId(null);
    document.body.style.overflow = "";
  };

  // Reset all filters
  const resetFilters = () => {
    setCourseId("");
    setSelectedSpecializations([]);
    setSelectedSoftwares([]);
    setSelectedStack(null);
    setSelectedLanguages([]);
  };

  // Handle education selection
  const handleCourseChange = (selectedCourse) => {
    // Toggle course if already selected
    setCourseId(courseId === selectedCourse ? "" : selectedCourse);

    // Reset education-specific filters when education changes
    if (selectedCourse === "dd") {
      setSelectedStack(null);
      setSelectedLanguages([]);
    } else if (selectedCourse === "wu") {
      setSelectedSpecializations([]);
      setSelectedSoftwares([]);
    }
  };

  // Toggle filter panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Generic toggle handler for filter arrays
  const handleFilterToggle = (setter, current, value) => {
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  // Helper functions for different filter types
  const handleSpecializationToggle = (value) => {
    handleFilterToggle(
      setSelectedSpecializations,
      selectedSpecializations,
      value
    );
  };

  const handleSoftwareToggle = (value) => {
    handleFilterToggle(setSelectedSoftwares, selectedSoftwares, value);
  };

  const handleLanguageToggle = (value) => {
    handleFilterToggle(setSelectedLanguages, selectedLanguages, value);
  };

  // Handle stack selection (only one can be selected)
  const handleStackToggle = (value) => {
    setSelectedStack(selectedStack === value ? null : value);
  };

  // Check if a button should be active
  const isButtonActive = (type, value) => {
    switch (type) {
      case "course":
        return courseId === value;
      case "specialization":
        return selectedSpecializations.includes(value);
      case "software":
        return selectedSoftwares.includes(value);
      case "stack":
        return selectedStack === value;
      case "language":
        return selectedLanguages.includes(value);
      default:
        return false;
    }
  };

  if (isLoading) {
    return <div className="loading">Loading student profiles...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="browse-students-container">
      <button className="filter-toggle-button" onClick={toggleFilters}>
        Filter
        <img src="../../public/assets/images/filter.svg" alt="filter icon" />
      </button>

      {showFilters && (
        <div className="filter-modal">
          <div className="filter-modal-content">
            <div className="filter-modal-header">
              <h2>Filter Your Search</h2>
              <button className="close-button" onClick={toggleFilters}>
                ×
              </button>
            </div>

            <div className="filter-section">
              <h3>Education</h3>
              <div className="filter-buttons">
                <button
                  className={`filter-button ${
                    isButtonActive("course", "dd") ? "active" : ""
                  }`}
                  onClick={() => handleCourseChange("dd")}
                >
                  Digital Design
                </button>
                <button
                  className={`filter-button ${
                    isButtonActive("course", "wu") ? "active" : ""
                  }`}
                  onClick={() => handleCourseChange("wu")}
                >
                  Web Development
                </button>
              </div>
            </div>

            {/* Digital Design filters */}
            {(courseId === "" || courseId === "dd") && (
              <>
                <div className="filter-section">
                  <h3>Specialization</h3>
                  <div className="filter-buttons">
                    {specializations.map((spec) => (
                      <button
                        key={spec.value}
                        className={`filter-button ${
                          isButtonActive("specialization", spec.value)
                            ? "active"
                            : ""
                        }`}
                        onClick={() => handleSpecializationToggle(spec.value)}
                      >
                        {spec.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3>Design Software</h3>
                  <div className="filter-buttons">
                    {softwares.map((software) => (
                      <button
                        key={software.value}
                        className={`filter-button ${
                          isButtonActive("software", software.value)
                            ? "active"
                            : ""
                        }`}
                        onClick={() => handleSoftwareToggle(software.value)}
                      >
                        {software.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Web Development filters */}
            {(courseId === "" || courseId === "wu") && (
              <>
                <div className="filter-section">
                  <h3>Stack</h3>
                  <div className="filter-buttons">
                    {stacks.map((stack) => (
                      <button
                        key={stack.value}
                        className={`filter-button ${
                          isButtonActive("stack", stack.value) ? "active" : ""
                        }`}
                        onClick={() => handleStackToggle(stack.value)}
                      >
                        {stack.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3>Languages/Frameworks</h3>
                  <div className="filter-buttons">
                    {languages.map((language) => (
                      <button
                        key={language.value}
                        className={`filter-button ${
                          isButtonActive("language", language.value)
                            ? "active"
                            : ""
                        }`}
                        onClick={() => handleLanguageToggle(language.value)}
                      >
                        {language.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="filter-actions">
              <button className="filter-apply-button" onClick={toggleFilters}>
                Apply Filters
              </button>
              <button className="filter-reset-button" onClick={resetFilters}>
                Clear All ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <div className="students-count">
        Showing {filteredStudents.length} of {students.length} students
      </div> */}

      <div className="students-grid">
        <h1>Sök kandidater</h1>

        <section className="cards-grid">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                cardId={student._id}
                isActive={student._id === activeCardId}
                onActivate={handleCardActivation}
                inBrowseView={true}
              />
            ))
          ) : (
            <div className="no-results">
              No students match your filters. Try different filter options.
            </div>
          )}
        </section>
      </div>

      {/* Single overlay for all cards */}
      {activeCardId && (
        <div className="blur-overlay" onClick={handleOverlayClick}></div>
      )}
    </div>
  );
}
