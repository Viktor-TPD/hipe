import { useState, useEffect, useCallback } from "react";
import StudentCard from "./StudentCard";
import { specializations, softwares, languages, stacks } from "./FormData";
import { API_BASE_URL } from "./../config";
import "./../styles/browse.css";
import "./../styles/filter.css";

export default function BrowseStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCardId, setActiveCardId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [courseId, setCourseId] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedSoftwares, setSelectedSoftwares] = useState([]);
  const [selectedStack, setSelectedStack] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/students/`);

        if (!response.ok) {
          throw new Error("Failed to fetch student profiles");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("Invalid response format from server");
        }

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

  const applyFilters = useCallback(() => {
    const results = students.filter((student) => {
      if (courseId && student.courseId !== courseId) {
        return false;
      }

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

      if (
        selectedSoftwares.length > 0 &&
        (courseId === "" || courseId === "dd") &&
        (!student.software ||
          !selectedSoftwares.some((sw) => student.software.includes(sw)))
      ) {
        return false;
      }

      if (
        selectedStack &&
        (courseId === "" || courseId === "wu") &&
        student.stack !== selectedStack
      ) {
        return false;
      }

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

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleCardActivation = (cardId, isActive) => {
    setActiveCardId(isActive ? cardId : null);

    document.body.style.overflow = isActive ? "hidden" : "";
  };

  const handleOverlayClick = () => {
    setActiveCardId(null);
    document.body.style.overflow = "";
  };

  const resetFilters = () => {
    setCourseId("");
    setSelectedSpecializations([]);
    setSelectedSoftwares([]);
    setSelectedStack(null);
    setSelectedLanguages([]);
  };

  const handleCourseChange = (selectedCourse) => {
    setCourseId(courseId === selectedCourse ? "" : selectedCourse);

    if (selectedCourse === "dd") {
      setSelectedStack(null);
      setSelectedLanguages([]);
    } else if (selectedCourse === "wu") {
      setSelectedSpecializations([]);
      setSelectedSoftwares([]);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterToggle = (setter, current, value) => {
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

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

  const handleStackToggle = (value) => {
    setSelectedStack(selectedStack === value ? null : value);
  };

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
        <img src="/assets/images/filter.svg" alt="filter icon" />
      </button>

      {showFilters && (
        <div className="filter-modal">
          <div className="filter-modal-content">
            <div className="filter-modal-header">
              <h2>Filtrera din sökning</h2>
              <button className="close-button" onClick={toggleFilters}>
                ×
              </button>
            </div>

            <div className="filter-section">
              <h3>Utbildning</h3>
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
                  Webbutveckling
                </button>
              </div>
            </div>

            {(courseId === "" || courseId === "dd") && (
              <>
                <div className="filter-section">
                  <h3>Inriktning</h3>
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
                  <h3>Program</h3>
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

            {(courseId === "" || courseId === "wu") && (
              <>
                <div className="filter-section">
                  <h3>Techstack</h3>
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
                  <h3>Språk/ramverk</h3>
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
                Filtrera
              </button>
              <button className="filter-reset-button" onClick={resetFilters}>
                Rensa ×
              </button>
            </div>
          </div>
        </div>
      )}

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

      {activeCardId && (
        <div className="blur-overlay" onClick={handleOverlayClick}></div>
      )}
    </div>
  );
}
