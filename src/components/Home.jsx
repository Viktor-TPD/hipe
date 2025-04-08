import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./../AuthContext";

function Home() {
  const { currentUser, logout } = useAuth();
  const userType = currentUser?.userType;

  const handleLogout = () => {
    logout();
  };

  const renderHomeContent = () => {
    if (userType === "student") {
      return (
        <div className="student-dashboard">
          <h2>{currentUser.userId}</h2>
          <p>Welcome to your student dashboard!</p>
          <Link to="/profile">Create/Edit Profile</Link>
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
          <Link to="/profile">Edit Company Profile</Link>
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
      <main className="dashboard-content">{renderHomeContent}</main>
    </div>
  );
}

export default Home;
