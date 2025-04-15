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

  const [courseId, setCourseId] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedSoftwares, setSelectedSoftwares] = useState([]);
  const [selectedStack, setSelectedStack] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/companies/`);

        if (!response.ok) {
          throw new Error("Failed to fetch student profiles");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("Invalid response format from server");
        }

        const companyData = responseData.data;

        setCompanies(companyData);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to load company profiles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleCardActivation = (cardId, isActive) => {
    setActiveCardId(isActive ? cardId : null);

    if (isActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const handleOverlayClick = () => {
    setActiveCardId(null);
    document.body.style.overflow = "";
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSpecializationToggle = (value) => {
    setSelectedSpecializations((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
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

      {activeCardId && (
        <div className="blur-overlay" onClick={handleOverlayClick}></div>
      )}
    </div>
  );
}
