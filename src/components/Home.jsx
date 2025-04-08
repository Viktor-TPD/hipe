import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./../AuthContext";
import "./../styles/home.css";
function Home() {
  const { currentUser } = useAuth();
  const userType = currentUser?.userType;
  const showImage = true;

  const renderHomeContent = () => {
    // form goes here? @todo
  };

  return (
    <div className="home-container">
      {showImage && (
        <div className="image-container">
          <img src="/assets/images/BG-map.png" alt="" />
        </div>
      )}
      <div className="gradient-overlay"></div>
      <main className="home-content">{renderHomeContent()}</main>
    </div>
  );
}

export default Home;
