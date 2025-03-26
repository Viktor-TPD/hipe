import { useLocation, Link } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get("userType");

  const renderDashboardContent = () => {
    if (userType === "student") {
      return (
        <div className="student-dashboard">
          <h2>Student Dashboard</h2>
          <p>Welcome to your student dashboard! Here you can:</p>
          <ul>
            <li>Set your preferences for tools, tech stacks etc.</li>
            <li>See what companies connected with you :)</li>
          </ul>
        </div>
      );
    } else if (userType === "company") {
      return (
        <div className="company-dashboard">
          <h2>Company Dashboard</h2>
          <p>Welcome to your company dashboard! Here you can:</p>
          <ul>
            <li>Manage your company profile</li>
            <li>Post new internship opportunities</li>
            <li>Connect with potential candidates</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="error-dashboard">
          <h2>Error: User Type Not Found</h2>
          <p>
            We couldn't determine your user type. Please go back to the form and
            try again.
          </p>
          <Link to="/">Back to Form</Link>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your personalized dashboard</p>
      </header>
      <main className="dashboard-content">{renderDashboardContent()}</main>
      <footer className="dashboard-footer">
        <Link to="/">Back to Home</Link>
      </footer>
    </div>
  );
}

export default Dashboard;
