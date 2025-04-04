import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./../AuthContext";
function Dashboard() {
  const { currentUser, logout } = useAuth();
  const userType = currentUser?.userType;

  const handleLogout = () => {
    logout();
  };

  const renderDashboardContent = () => {
    if (userType === "student") {
      return (
        <div className="student-dashboard">
          <h2>{currentUser.userId}</h2>
          <p>Welcome to your student dashboard!</p>
          <a href="/create-studentProfile">create student</a>
          <ul>
            <li>View and update your student profile</li>
            <li>See what companies who've reached out :)</li>
          </ul>
        </div>
      );
    } else if (userType === "company") {
      return (
        <div className="company-dashboard">
          <h2>{currentUser.userId}</h2>
          <p>Welcome to your company dashboard!</p>
          <a href="/create-companyProfile">Edit Details :)))))</a>
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
          <p>We couldn't determine your user type.</p>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Logged in as: {currentUser.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      <main className="dashboard-content">{renderDashboardContent()}</main>
    </div>
  );
}

export default Dashboard;
