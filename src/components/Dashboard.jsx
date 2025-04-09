import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./../AuthContext";
import StudentCard from "./StudentCard";
import { API_BASE_URL } from "../config";

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const userType = currentUser?.userType;
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current user's profile data (for testing StudentCard)
  useEffect(() => {
    if (currentUser?.userId) {
      const fetchUserProfile = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const response = await fetch(`${API_BASE_URL}/api/v1/users/${currentUser.userId}/profile`);
          
          if (!response.ok) {
            throw new Error("Failed to fetch profile data");
          }
          
          const data = await response.json();
          
          if (data.success && data.data.profile) {
            setStudentData(data.data.profile);
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          setError("Could not load profile data");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserProfile();
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
  };

  // Sample student data for demo purposes
  const sampleStudentDD = {
    _id: "sample-dd-id",
    name: "Anna Andersson",
    courseId: "dd",
    description: "Kreativ designer med fokus på användarupplevelse och visuell kommunikation.",
    specialization: ["ux", "ui", "servicedesign"],
    software: ["figma", "illustrator", "photoshop"],
    portfolio: "https://portfolio.example.com",
    linkedin: "https://linkedin.com/in/example",
    profileImageUrl: ""
  };
  
  const sampleStudentWU = {
    _id: "sample-wu-id",
    name: "Erik Eriksson",
    courseId: "wu",
    description: "Full-stack utvecklare med passion för clean code och användbara webbapplikationer.",
    stack: "fullstack",
    languages: ["javascript", "react", "nodejs"],
    portfolio: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
    profileImageUrl: ""
  };

  const renderDashboardContent = () => {
    if (userType === "student") {
      return (
        <div className="student-dashboard">
          <h2>Välkommen till din studentprofil!</h2>
          <p>Här kan du hantera din profil och se företag som letar efter praktikanter.</p>
          
          <div className="dashboard-actions">
            <Link to="/profile">
              {/* <Button variant="primary">Redigera Profil</Button> */}
            </Link>
            <Link to="/browse">
              {/* <Button variant="primary">Bläddra bland företag</Button> */}
            </Link>
          </div>
          
          <h3>Din Profil</h3>
          {isLoading ? (
            <p>Laddar profildata...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : studentData ? (
            <StudentCard student={studentData} />
          ) : (
            <p>Ingen profildata hittades. <Link to="/profile">Skapa din profil</Link></p>
          )}
        </div>
      );
    } else if (userType === "company") {
      return (
        <div className="company-dashboard">
          <h2>Välkommen till din företagsprofil!</h2>
          <p>Här kan du hantera din företagsprofil och hitta potentiella praktikanter.</p>
          
          <div className="dashboard-actions">
            <Link to="/profile">
              <Button variant="primary">Redigera Företagsprofil</Button>
            </Link>
            <Link to="/browse">
              <Button variant="primary">Bläddra bland studenter</Button>
            </Link>
          </div>
          
          <h3>Studentprofiler Demo</h3>
          <div className="student-card-demo">
            <h4>Digital Design Student</h4>
            <StudentCard student={sampleStudentDD} />
            
            <h4>Webbutveckling Student</h4>
            <StudentCard student={sampleStudentWU} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="error-dashboard">
          <h2>Fel: Användartyp hittades inte</h2>
          <p>Vi kunde inte avgöra vilken typ av användare du är.</p>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Inloggad som: {currentUser.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logga ut
          </button>
        </div>
      </header>
      <main className="dashboard-content">{renderDashboardContent()}</main>
    </div>
  );
}

export default Dashboard;