import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./../AuthContext";
import { useNotification } from "./../NotificationContext";
import { useAuthForm } from "./../AuthFormContext";
import { API_BASE_URL } from "./../config";

import Form from "./Form";
import TextField from "./fields/TextField";
import RadioField from "./fields/RadioField";
import FormWrapper from "./FormWrapper";

import "./../styles/styles.css";
import "./../styles/form.css";
import "./../styles/imageUpload.css";
import "./../styles/home.css";
import "./../styles/radioField.css";

function Home() {
  const { currentUser, login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const { formType } = useAuthForm();

  const [userType, setUserType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleLoginSubmit = async (data) => {
    try {
      setError("");
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Invalid email or password");
      }

      const userData = responseData.data;

      login({
        userId: userData._id,
        email: userData.email,
        userType: userData.userType,
      });

      showNotification("Inloggning lyckades!", "success");
    } catch (error) {
      setError(error.message || "Failed to login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data) => {
    try {
      setError("");
      setIsLoading(true);

      if (data.password.length < 6) {
        setError("Lösenordet måste vara minst 6 tecken långt");
        setIsLoading(false);
        return;
      }

      if (data.password !== data.confirmPassword) {
        setError("Lösenorden matchar inte");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          userType: userType,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      const userData = responseData.data;

      if (!userData) {
        throw new Error("Invalid response format from server");
      }

      login({
        userId: userData._id,
        email: userData.email,
        userType: userData.userType,
      });

      showNotification("Registrering lyckades!", "success");
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => {
    return (
      <Form
        onSubmit={handleLoginSubmit}
        submitLabel={isLoading ? "Loggar in..." : "Logga in"}
        disabled={isLoading}
      >
        <TextField
          type="email"
          name="email"
          label="Email"
          required={true}
          placeholder="Ange din email"
          autoComplete="email"
        />

        <TextField
          type="password"
          name="password"
          label="Lösenord"
          required={true}
          placeholder="Ange ditt lösenord"
          autoComplete="current-password"
        />
      </Form>
    );
  };

  // Custom RadioField specifically for user type toggle
  const renderUserTypeToggle = () => {
    return (
      <div className="field-container">
        <label className="field-label">Kontotyp</label>
        <div className="options-container usertype-toggle">
          <input
            type="radio"
            id="student-option"
            name="userType"
            value="student"
            checked={userType === "student"}
            onChange={handleUserTypeChange}
            className="radio-input"
          />
          <label htmlFor="student-option" className="option-label student">
            Student
          </label>

          <input
            type="radio"
            id="company-option"
            name="userType"
            value="company"
            checked={userType === "company"}
            onChange={handleUserTypeChange}
            className="radio-input"
          />
          <label htmlFor="company-option" className="option-label company">
            Företag
          </label>
        </div>
      </div>
    );
  };

  const renderRegisterForm = () => {
    return (
      <Form
        onSubmit={handleRegisterSubmit}
        submitLabel={isLoading ? "Registrerar..." : "Registrera"}
        disabled={isLoading}
      >
        {renderUserTypeToggle()}

        <FormWrapper className="home-form-wrapper">
          <TextField
            type="email"
            name="email"
            label="Email"
            required={true}
            placeholder="Ange din email"
            autoComplete="email"
          />

          <TextField
            type="password"
            name="password"
            label="Lösenord"
            required={true}
            placeholder="Skapa ett lösenord"
            autoComplete="new-password"
          />

          <TextField
            type="password"
            name="confirmPassword"
            label="Bekräfta lösenord"
            required={true}
            placeholder="Bekräfta ditt lösenord"
            autoComplete="new-password"
          />
        </FormWrapper>
      </Form>
    );
  };

  const renderHomeContent = () => {
    return (
      <>
        <article className="home-aside-left">
          <h1>Välkommen till Yrgos Branschevent!</h1>
          <p>
            Där framtidens digitala designers och webbutvecklare möter
            branschen! Letar du efter en LIA-plats eller nya talanger?
            <br></br>
            <br></br>
            Här skapas möjligheter, nätverk och framtida samarbeten!
          </p>
          <section className="home-info-container">
            <div className="home-info-item">
              <img src="/assets/images/icon-map-pin.svg" alt="" />
              <p>Visual Arena, Lindholmen</p>
            </div>
            <div className="home-info-item">
              <img src="/assets/images/icon-calendar.svg" alt="" />
              <p>23 April</p>
            </div>
            <div className="home-info-item">
              <img src="/assets/images/icon-clock.svg" alt="" />
              <p>13:00 - 15:00</p>
            </div>
          </section>
        </article>
        <aside>
          {!currentUser && (
            <section className="home-aside-right">
              <h3>{formType === "login" ? "Logga in" : "Registrera dig"}</h3>
              {error && <div className="error-message">{error}</div>}
              {formType === "login" ? renderLoginForm() : renderRegisterForm()}
            </section>
          )}
        </aside>
      </>
    );
  };

  return (
    <div className="home-container">
      <div className="image-container">
        <img src="/assets/images/BG-map.png" alt="" />
      </div>
      <div className="gradient-overlay"></div>
      <main className="home-content">{renderHomeContent()}</main>
    </div>
  );
}

export default Home;
