import { useState, useEffect } from "react";
import CompanyCard from "./CompanyCard";
import { API_BASE_URL } from "./../config";
import "./../styles/browse.css";
import "./../styles/filter.css";
import "./../styles/card.css";

export default function BrowseStudents() {
  const [companies, setCompanies] = useState([]);
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

  // Fetch all companies when component loads
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/companies/`);

        if (!response.ok) {
          throw new Error("Failed to fetch student profiles");
        }

        const responseData = await response.json();

        // Check if the response has the expected structure
        if (!responseData.success || !responseData.data) {
          throw new Error("Invalid response format from server");
        }

        // Extract company data from the response
        const companyData = responseData.data;

        setCompanies(companyData);
        
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to load company profiles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    console.log("HÄRÄÄRÄ" + companies)
    fetchCompanies();
  }, []);

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

  if (isLoading) {
    return <div className="loading">Laddar företagsprofiler...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="browse-companies-container">
    
      <div className="companies-grid">
        <h1>Bläddra bland företag</h1>
        <section className="cards-grid">
          {companies.length > 0 ? (
            companies.map((company) => (
              <CompanyCard 
                key={company._id} 
                company={company} 
                cardId={company._id}
                isActive={company._id === activeCardId}
                onActivate={handleCardActivation}
                inBrowseView={true}
              />
            ))
          ) : (
            <div className="no-results">
              Det finns tyvärr inga företag att visa.
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