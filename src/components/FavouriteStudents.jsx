import { useState, useEffect, useCallback } from "react";
import StudentCard from "./StudentCard";
import { useUserProfile } from "./hooks/useProfile";
import { useAuth } from "./../AuthContext";
import { useNotification } from "./../NotificationContext";
import { specializations, softwares, languages, stacks } from "./FormData";
import { API_BASE_URL } from "./../config";
import "./../styles/browse.css";
import "./../styles/filter.css";

export default function FavouriteStudents() {
  const { currentUser } = useAuth();
  const { profileData } = useUserProfile();
  const { showNotification } = useNotification();
  
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

  // Fetch liked students when component loads and companyId is available
  useEffect(() => {
    const fetchLikedStudents = async () => {
      // Get company ID from profileData
      const companyId = profileData?.profile?._id;
      
      if (!companyId) {
        setIsLoading(false);
        setError("Company profile not found. Please complete your profile first.");
        return;
      }
    
      try {
        setIsLoading(true);
        
        // Steg 1: Hämta likes för företaget
        const likesResponse = await fetch(`${API_BASE_URL}/api/v1/likes/company/${companyId}`);
    
        if (!likesResponse.ok) {
          throw new Error("Failed to fetch liked student profiles");
        }
    
        const likesData = await likesResponse.json();
    
        if (!likesData.success || !likesData.data) {
          throw new Error("Invalid response format from server");
        }
    
        // Steg 2: Extrahera student IDs från likes
        const studentIds = likesData.data
          .map(like => like.studentId._id || like.studentId)
          .filter(id => id);
    
        if (studentIds.length === 0) {
          setStudents([]);
          setFilteredStudents([]);
          setIsLoading(false);
          return;
        }
    
        // Steg 3: Hämta fullständiga studentdata för varje ID
        const studentPromises = studentIds.map(async (studentId) => {
          const studentResponse = await fetch(`${API_BASE_URL}/api/v1/students/${studentId}`);
          if (!studentResponse.ok) return null;
          
          const studentData = await studentResponse.json();
          return studentData.success && studentData.data ? studentData.data : null;
        });
    
        const studentResults = await Promise.all(studentPromises);
        const validStudentData = studentResults.filter(student => student);
        
        console.log(`Found ${validStudentData.length} liked students with complete data`);
        
        setStudents(validStudentData);
        setFilteredStudents(validStudentData);
      } catch (error) {
        console.error("Error fetching liked students:", error);
        setError("Failed to load liked student profiles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (profileData?.profile) {
      fetchLikedStudents();
    }
  }, [profileData]);

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
    return <div className="loading">Laddar sparade kandidater...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="browse-students-container">

            <div className="filter-section filter-section-favourites">
              <h3>Utbildning</h3>
              <div className="filter-buttons filter-buttons-favourites">
                <button
                  className={`filter-button-favourites filter-button ${
                    isButtonActive("course", "dd") ? "active" : ""
                  }`}
                  onClick={() => handleCourseChange("dd")}
                >
                  Digital Design
                </button>
                <button
                  className={`filter-button-favourites filter-button ${
                    isButtonActive("course", "wu") ? "active" : ""
                  }`}
                  onClick={() => handleCourseChange("wu")}
                >
                  Webbutveckling
                </button>
              </div>
            </div>
      

      <div className="students-grid students-grid-favourites">
        <h1 id="favourites">Sparade kandidater</h1>

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
              Inga sparade kandidater. Gå till "Sök kandidater" för att hitta och spara studenter.
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