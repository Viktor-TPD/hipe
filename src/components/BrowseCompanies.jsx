import { useState, useEffect } from "react";
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

  // Update filtering when filters change
  useEffect(() => {
    applyFilters();
  }, [
    courseId,
    selectedSpecializations,
    selectedSoftwares,
    selectedStack,
    selectedLanguages,
  ]);

  // Handle card activation/deactivation
  const handleCardActivation = (cardId, isActive) => {
    setActiveCardId(isActive ? cardId : null);

    // Lock body scrolling when a card is maximized
    if (isActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  // Handle overlay click
  const handleOverlayClick = () => {
    setActiveCardId(null);
    document.body.style.overflow = "";
  };

  // Function to apply filters
  const applyFilters = () => {
    let results = [...students];

    // Filter by education if selected
    if (courseId) {
      results = results.filter((student) => student.courseId === courseId);
    }

    // Filter by specialization if any are selected and the education is DD
    if (
      selectedSpecializations.length > 0 &&
      (courseId === "" || courseId === "dd")
    ) {
      results = results.filter(
        (student) =>
          student.specialization &&
          selectedSpecializations.some((spec) => student.specialization.includes(spec))
      );
    }

    // Filter by software if any are selected and the education is DD
    if (
      selectedSoftwares.length > 0 &&
      (courseId === "" || courseId === "dd")
    ) {
      results = results.filter(
        (student) =>
          student.software &&
          selectedSoftwares.some((sw) => student.software.includes(sw))
      );
    }

    // Filter by stack if selected and the education is WU
    if (selectedStack && (courseId === "" || courseId === "wu")) {
      results = results.filter(
        (student) => student.stack === selectedStack
      );
    }

    // Filter by languages if any are selected and the education is WU
    if (
      selectedLanguages.length > 0 &&
      (courseId === "" || courseId === "wu")
    ) {
      results = results.filter(
        (student) =>
          student.languages &&
          selectedLanguages.some((lang) => student.languages.includes(lang))
      );
    }

    setFilteredStudents(results);
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
    setCourseId(selectedCourse);

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

  // Handle specialization checkbox toggle
  const handleSpecializationToggle = (value) => {
    setSelectedSpecializations(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // Handle software checkbox toggle
  const handleSoftwareToggle = (value) => {
    setSelectedSoftwares(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // Handle stack selection (only one can be selected)
  const handleStackToggle = (value) => {
    setSelectedStack(selectedStack === value ? null : value);
  };

  // Handle language checkbox toggle
  const handleLanguageToggle = (value) => {
    setSelectedLanguages(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // Check if a button should be active
  const isButtonActive = (type, value) => {
    switch (type) {
      case 'course':
        return courseId === value;
      case 'specialization':
        return selectedSpecializations.includes(value);
      case 'software':
        return selectedSoftwares.includes(value);
      case 'stack':
        return selectedStack === value;
      case 'language':
        return selectedLanguages.includes(value);
      default:
        return false;
    }
  };

  if (isLoading) {
    return <div className="loading">Laddar studentprofiler...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="browse-students-container">
      <div className="browse-header">
        <h2>Bläddra bland företag</h2>
        <button 
          className="filter-toggle-button" 
          onClick={toggleFilters}
        >
          Filtrera
        </button>
      </div>

      {showFilters && (
        <div className="filter-modal">
          <div className="filter-modal-content">
            <div className="filter-modal-header">
              <h2>Filtrera din sökning</h2>
              <button 
                className="close-button" 
                onClick={toggleFilters}
              >
                ×
              </button>
            </div>

            <div className="filter-section">
              <h3>Utbildning</h3>
              <div className="filter-buttons">
                <button 
                  className={`filter-button ${isButtonActive('course', 'dd') ? 'active' : ''}`}
                  onClick={() => handleCourseChange('dd')}
                >
                  Digital Design
                </button>
                <button 
                  className={`filter-button ${isButtonActive('course', 'wu') ? 'active' : ''}`}
                  onClick={() => handleCourseChange('wu')}
                >
                  Webbutveckling
                </button>
              </div>
            </div>

            {(courseId === '' || courseId === 'dd') && (
              <>
                <div className="filter-section">
                  <h3>Inriktning</h3>
                  <div className="filter-buttons">
                    <button 
                      className={`filter-button ${isButtonActive('specialization', 'Film') ? 'active' : ''}`}
                      onClick={() => handleSpecializationToggle('Film')}
                    >
                      Film
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('specialization', 'Frontend') ? 'active' : ''}`}
                      onClick={() => handleSpecializationToggle('Frontend')}
                    >
                      Frontend
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('specialization', 'MotionDesign') ? 'active' : ''}`}
                      onClick={() => handleSpecializationToggle('MotionDesign')}
                    >
                      MotionDesign
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('specialization', 'ServiceDesign') ? 'active' : ''}`}
                      onClick={() => handleSpecializationToggle('ServiceDesign')}
                    >
                      ServiceDesign
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('specialization', 'UI') ? 'active' : ''}`}
                      onClick={() => handleSpecializationToggle('UI')}
                    >
                      UI
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('specialization', 'UX') ? 'active' : ''}`}
                      onClick={() => handleSpecializationToggle('UX')}
                    >
                      UX
                    </button>
                  </div>
                </div>

                <div className="filter-section">
                  <h3>DesignProgram</h3>
                  <div className="filter-buttons">
                    <button 
                      className={`filter-button ${isButtonActive('software', '3D Stager') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('3D Stager')}
                    >
                      3D Stager
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'Aftereffects') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('Aftereffects')}
                    >
                      Aftereffects
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'Blender 3D') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('Blender 3D')}
                    >
                      Blender 3D
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'Cavelry') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('Cavelry')}
                    >
                      Cavelry
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'Figma') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('Figma')}
                    >
                      Figma
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'Framer') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('Framer')}
                    >
                      Framer
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'Illustrator') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('Illustrator')}
                    >
                      Illustrator
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'InDesign') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('InDesign')}
                    >
                      InDesign
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'Photoshop') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('Photoshop')}
                    >
                      Photoshop
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'PremierPro') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('PremierPro')}
                    >
                      PremierPro
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'VS Code') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('VS Code')}
                    >
                      VS Code
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'Webflow') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('Webflow')}
                    >
                      Webflow
                    </button>
                    <button 
                      className={`filter-button ${isButtonActive('software', 'Wordpress') ? 'active' : ''}`}
                      onClick={() => handleSoftwareToggle('Wordpress')}
                    >
                      Wordpress
                    </button>
                  </div>
                </div>
              </>
            )}

            {(courseId === '' || courseId === 'wu') && (
              <>
                <div className="filter-section">
                  <h3>Stack</h3>
                  <div className="filter-buttons">
                    {stacks.map(stack => (
                      <button 
                        key={stack.value}
                        className={`filter-button ${isButtonActive('stack', stack.value) ? 'active' : ''}`}
                        onClick={() => handleStackToggle(stack.value)}
                      >
                        {stack.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3>Språk/Ramverk</h3>
                  <div className="filter-buttons">
                    {languages.map(language => (
                      <button 
                        key={language.value}
                        className={`filter-button ${isButtonActive('language', language.value) ? 'active' : ''}`}
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
              <button 
                className="filter-apply-button"
                onClick={toggleFilters}
              >
                Filtrera
              </button>
              <button 
                className="filter-reset-button"
                onClick={resetFilters}
              >
                Rensa ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="students-count">
        Visar {filteredStudents.length} av {students.length} studenter
      </div>

      <div className="students-grid">
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
            Inga studenter matchar dina filter. Prova med andra filterval.
          </div>
        )}
      </div>

      {/* Single overlay for all cards */}
      {activeCardId && (
        <div className="blur-overlay" onClick={handleOverlayClick}></div>
      )}
    </div>
  );
}