import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./../AuthContext";
import { useProfile } from "./hooks/useProfile";

import Form from "./Form";
import TextField from "./fields/TextField";
import RadioField from "./fields/RadioField";
import SelectField from "./fields/SelectField";
import TextareaField from "./fields/TextAreaField";
import ProfileImageUpload from "./ProfilePictureUpload";
import FormWrapper from "./FormWrapper";

import "./../styles/styles.css";
import "./../styles/form.css";
import "./../styles/imageUpload.css";
import "./../styles/home.css";
function Home() {
  const { currentUser } = useAuth();
  const showImage = true;

  const renderHomeContent = () => {
    <section>
      {currentUser && (
        <div>
          <p>LOG IN STUFFS</p>
        </div>
      )}
    </section>;
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
