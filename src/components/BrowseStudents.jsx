import { useState, useEffect } from "react";
import StudentCard from "./StudentCard";
import { specializations, softwares, languages, stacks } from "./FormData";
import Select from "react-select";

export default function BrowseStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [courseId, setCourseId] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedSoftwares, setSelectedSoftwares] = useState([]);
  const [selectedStack, setSelectedStack] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  // Hämta alla studenter när komponenten laddas
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:4000/api/student-profiles");
        
     
        
        if (!response.ok) {
            throw new Error("Failed to fetch student profiles");
        }
        
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load student profiles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  // Uppdatera filtreringen när filter ändras
  useEffect(() => {
    applyFilters();
  }, [courseId, selectedSpecializations, selectedSoftwares, selectedStack, selectedLanguages]);

  // Funktion för att applicera filter
  const applyFilters = () => {
    let results = [...students];
    
    // Filtrera på utbildning om vald
    if (courseId) {
      results = results.filter(student => student.courseId === courseId);
    }
    
    // Filtrera på specialization om någon är vald och utbildningen är DD
    if (selectedSpecializations.length > 0 && (courseId === "" || courseId === "dd")) {
      results = results.filter(student => 
        student.specialization && 
        selectedSpecializations.some(spec => 
          student.specialization.includes(spec.value)
        )
      );
    }
    
    // Filtrera på software om någon är vald och utbildningen är DD
    if (selectedSoftwares.length > 0 && (courseId === "" || courseId === "dd")) {
      results = results.filter(student => 
        student.software && 
        selectedSoftwares.some(sw => 
          student.software.includes(sw.value)
        )
      );
    }
    
    // Filtrera på stack om vald och utbildningen är WU
    if (selectedStack && (courseId === "" || courseId === "wu")) {
      results = results.filter(student => 
        student.stack === selectedStack.value
      );
    }
    
    // Filtrera på languages om någon är vald och utbildningen är WU
    if (selectedLanguages.length > 0 && (courseId === "" || courseId === "wu")) {
      results = results.filter(student => 
        student.languages && 
        selectedLanguages.some(lang => 
          student.languages.includes(lang.value)
        )
      );
    }
    
    setFilteredStudents(results);
  };

  // Återställ alla filter
  const resetFilters = () => {
    setCourseId("");
    setSelectedSpecializations([]);
    setSelectedSoftwares([]);
    setSelectedStack(null);
    setSelectedLanguages([]);
  };

  // Hantera val av utbildning
  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    setCourseId(selectedCourse);
    
    // Återställ utbildningsspecifika filter när utbildning ändras
    if (selectedCourse === "dd") {
      setSelectedStack(null);
      setSelectedLanguages([]);
    } else if (selectedCourse === "wu") {
      setSelectedSpecializations([]);
      setSelectedSoftwares([]);
    }
  };

  // Rendera filtreringsdelen baserat på vald utbildning
  const renderCourseSpecificFilters = () => {
    if (courseId === "dd") {
      return (
        <>
          <div className="filter-group">
            <label>Inriktningar</label>
            <Select
              isMulti
              options={specializations}
              value={selectedSpecializations}
              onChange={setSelectedSpecializations}
              placeholder="Välj inriktningar..."
              className="filter-select"
            />
          </div>
          
          <div className="filter-group">
            <label>Designprogram</label>
            <Select
              isMulti
              options={softwares}
              value={selectedSoftwares}
              onChange={setSelectedSoftwares}
              placeholder="Välj designprogram..."
              className="filter-select"
            />
          </div>
        </>
      );
    } else if (courseId === "wu") {
      return (
        <>
          <div className="filter-group">
            <label>Stack</label>
            <Select
              options={stacks}
              value={selectedStack}
              onChange={setSelectedStack}
              placeholder="Välj stack..."
              className="filter-select"
              isClearable
            />
          </div>
          
          <div className="filter-group">
            <label>Språk/Ramverk</label>
            <Select
              isMulti
              options={languages}
              value={selectedLanguages}
              onChange={setSelectedLanguages}
              placeholder="Välj språk/ramverk..."
              className="filter-select"
            />
          </div>
        </>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div className="loading">Laddar studentprofiler...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="browse-students-container">
      <h2>Bläddra bland studenter</h2>
      
      <div className="filters-section">
        <h3>Filtrera studenter</h3>
        
        <div className="filter-group">
          <label>Utbildning</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="courseId"
                value=""
                checked={courseId === ""}
                onChange={handleCourseChange}
              />
              Alla
            </label>
            <label>
              <input
                type="radio"
                name="courseId"
                value="dd"
                checked={courseId === "dd"}
                onChange={handleCourseChange}
              />
              Digital Design
            </label>
            <label>
              <input
                type="radio"
                name="courseId"
                value="wu"
                checked={courseId === "wu"}
                onChange={handleCourseChange}
              />
              Webutveckling
            </label>
          </div>
        </div>
        
        {renderCourseSpecificFilters()}
        
        <button className="reset-filters-button" onClick={resetFilters}>
          Återställ filter
        </button>
      </div>
      
      <div className="students-count">
        Visar {filteredStudents.length} av {students.length} studenter
      </div>
      
      <div className="students-grid">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <StudentCard key={student._id} student={student} />
          ))
        ) : (
          <div className="no-results">
            Inga studenter matchar dina filter. Prova med andra filterval.
          </div>
        )}
      </div>
    </div>
  );
}