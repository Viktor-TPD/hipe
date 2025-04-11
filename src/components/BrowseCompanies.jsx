import { useState, useEffect } from "react";
import CompanyCard from "./CompanyCard";
import { specializations, softwares, languages, stacks } from "./FormData";
import Select from "react-select";
import { API_BASE_URL } from "./../config";
import "./../styles/browse.css";

export default function BrowseCompanies() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCardId, setActiveCardId] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/companies`);

        if (!response.ok) {
          throw new Error("Failed to fetch company profiles");
        }

        const data = await response.json();
        setCompanies(data.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to load company profiles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

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

  if (isLoading) {
    return <div className="loading">Laddar företagsprofiler...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="browse-companies-container">
        <Button></Button>
      <div className="companies-grid">
        {companies.map((company) => (
          <CompanyCard
            key={company._id}
            company={company}
            inBrowseView={true}
            cardId={company._id}
            isActive={company._id === activeCardId}
            onActivate={handleCardActivation}
          />
        ))}
      </div>

      {/* Single overlay for all cards */}
      {activeCardId && (
        <div className="blur-overlay" onClick={handleOverlayClick}></div>
      )}
    </div>
  );
}
