import { useState, useEffect } from "react";
import CompanyCard from "./CompanyCard";
import { specializations, softwares, languages, stacks } from "./FormData";
import Select from "react-select";
import { API_BASE_URL } from "./config";

export default function BrowseCompanies() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Failed to load comapny profiles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (isLoading) {
    return <div className="loading">Laddar företagsprofiler...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="browse-companies-container">
      <h2>Bläddra bland Företag</h2>

      <div className="companies-grid">
        {companies.map((company) => (
          <CompanyCard key={company._id} company={company} />
        ))}
      </div>
    </div>
  );
}
