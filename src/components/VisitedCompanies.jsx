import { useState, useEffect } from "react";
import { useAuth } from "./../AuthContext";
import { useNotification } from "./../NotificationContext";
import { API_BASE_URL } from "./../config";
import CompanyCard from "./CompanyCard";

import "./../styles/visitedCompanies.css";

export default function VisitedCompanies({ studentId }) {
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [activeCardId, setActiveCardId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Fetch companies that liked this student
  useEffect(() => {
    const fetchVisitedCompanies = async () => {
      if (!studentId) {
        setIsLoading(false);
        setError(
          "Student profile not found. Please complete your profile first."
        );
        return;
      }

      try {
        setIsLoading(true);

        // Use the specific endpoint to get companies that liked this student
        const response = await fetch(
          `${API_BASE_URL}/api/v1/likes/student/${studentId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch companies that liked your profile");
        }

        const responseData = await response.json();

        // Check if the response has the expected structure
        if (!responseData.success || !responseData.data) {
          throw new Error("Invalid response format from server");
        }

        console.log("Companies that liked this student:", responseData.data);

        // Extract company data from each like
        const companyData = responseData.data.map((like) => like.companyId);

        // Filter out any potential null/undefined values
        const validCompanyData = companyData.filter((company) => company);

        console.log(
          `Found ${validCompanyData.length} companies that liked this student`
        );

        setCompanies(validCompanyData);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to load companies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      fetchVisitedCompanies();
    } else {
      setIsLoading(false);
      setError(
        "You need to create a profile first to see companies that liked you."
      );
    }
  }, [studentId]);

  // Handle card activation/deactivation
  const handleCardActivation = (cardId, isActive, company) => {
    setActiveCardId(isActive ? cardId : null);
    setSelectedCompany(isActive ? company : null);

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
    setSelectedCompany(null);
    document.body.style.overflow = "";
  };

  // Handle click on a mini card
  const handleMiniCardClick = (company) => {
    setSelectedCompany(company);
    setActiveCardId(company._id);
    document.body.style.overflow = "hidden";
  };

  // Handle close card
  const handleCloseCard = () => {
    setActiveCardId(null);
    setSelectedCompany(null);
    document.body.style.overflow = "";
  };

  if (isLoading) {
    return <div className="loading-companies">Laddar företag...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="visited-companies-container">
      <h3>Företag som sparat dig</h3>

      {companies.length > 0 ? (
        <div className="companies-list">
          {companies.map((company) => (
            <div
              key={company._id}
              className="company-mini-card"
              onClick={() => handleMiniCardClick(company)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleMiniCardClick(company);
                }
              }}
              tabIndex="0"
              role="button"
              aria-label={`View details for ${company.companyName}`}
            >
              <div className="company-mini-image">
                {company.profileImageUrl ? (
                  <img
                    src={company.profileImageUrl}
                    alt={company.companyName}
                  />
                ) : (
                  <div className="company-initial">
                    {company.companyName ? company.companyName.charAt(0) : "?"}
                  </div>
                )}
              </div>
              <p className="company-mini-name">{company.companyName}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-companies">
          Inga företag har sparat din profil ännu.
        </div>
      )}

      {/* Display the selected company card */}
      {selectedCompany && (
        <>
          <div className="company-card-container">
            <CompanyCard
              company={selectedCompany}
              cardId={selectedCompany._id}
              isActive={true}
              onActivate={(id, isActive) =>
                handleCardActivation(id, isActive, selectedCompany)
              }
              onClose={handleCloseCard}
              inBrowseView={false}
            />
          </div>
          <div className="blur-overlay" onClick={handleOverlayClick}></div>
        </>
      )}
    </div>
  );
}
