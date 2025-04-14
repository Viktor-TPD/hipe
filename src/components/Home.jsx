import { useState } from "react";
import { NavLink } from "react-router-dom";
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
import CheckboxField from "./fields/CheckboxField";
import Button from "./buttons/Button";

function Home() {
  const { currentUser, login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const { formType, setFormType } = useAuthForm();

  const [userType, setUserType] = useState("student");
  const [userTypeValue, setUserTypeValue] = useState("Studenter");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUserTypeChange = (value) => {
    setUserType(value);
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
          userType: userType,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Felaktig email eller lösenord."
        );
      }

      const userData = responseData.data;

      login({
        userId: userData._id,
        email: userData.email,
        userType: userData.userType,
      });

      showNotification("Inloggning lyckades!", "success");
      navigate("/profile");
    } catch (error) {
      setError(error.message || "Inloggning misslyckades. Försök igen.");
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
        throw new Error(responseData.message || "Registrering misslyckades.");
      }

      const userData = responseData.data;

      if (!userData) {
        throw new Error("Ogiltigt svar från server.");
      }

      login({
        userId: userData._id,
        email: userData.email,
        userType: userData.userType,
      });

      showNotification("Registrering lyckades!", "success");
      navigate("/profile");
    } catch (error) {
      setError(
        error.message || "Registrering misslyckades. Var vänlig försök igen."
      );
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => {
    return (
      <>
        {renderUserTypeToggle()}
        <FormWrapper className="home-form-wrapper">
          <h1>Logga in som {userTypeValue}</h1>
          <Form
            onSubmit={handleLoginSubmit}
            submitLabel={isLoading ? "Loggar in..." : "Logga in"}
            disabled={isLoading}
            bottomButtons={false}
          >
            <TextField
              type="email"
              name="email"
              label="Email"
              required={true}
              placeholder="Ange din email"
              autoComplete="email"
              id="home-login-email"
            />

            <TextField
              type="password"
              name="password"
              label="Lösenord"
              required={true}
              placeholder="Ange ditt lösenord"
              autoComplete="current-password"
            />

            <section className="home-checkbox-wrapper">
              <CheckboxField name="rememberMe" label="Kom ihåg mig?" />
              <Button variant="primary" type="submit">
                {isLoading ? "Loggar in..." : "Logga in"}
              </Button>
            </section>
            <NavLink onClick={() => handleFormTypeChange("register")}>
              Byt till Registrering
            </NavLink>
          </Form>
        </FormWrapper>
      </>
    );
  };

  const renderUserTypeToggle = () => {
    return (
      <div className="field-container">
        <RadioField
          name="userType"
          options={[
            { value: "student", label: "Student" },
            { value: "company", label: "Företag" },
          ]}
          value={userType}
          onValueChange={(e) => {
            if (e && e.target) {
              setUserType(e.target.value);
              if (e.target.value === "student") {
                setUserTypeValue(e.target.labels[0].innerHTML + "er");
              } else {
                setUserTypeValue(e.target.labels[0].innerHTML);
              }
            }
          }}
        />
      </div>
    );
  };

  const renderRegisterForm = () => {
    const handleFormTypeChange = (type) => {
      setFormType(type);
    };
    return (
      <>
        {renderUserTypeToggle()}
        <FormWrapper className="home-form-wrapper">
          <h1>Registrering för {userTypeValue}</h1>
          <Form
            onSubmit={handleRegisterSubmit}
            submitLabel={isLoading ? "Registrerar..." : "Skicka in"}
            disabled={isLoading}
            bottomButtons={false}
            id="home-register"
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
            <section className="home-checkbox-wrapper">
              <CheckboxField
                name="privacyPolicy"
                label={
                  <>
                    Jag har läst och godkänner{" "}
                    <NavLink to="/policy">integritetspolicyn</NavLink>
                  </>
                }
                required={true}
              />
              <Button variant="primary" type="submit">
                {isLoading ? "Registrerar..." : "Skicka in"}
              </Button>
            </section>
            <NavLink onClick={() => handleFormTypeChange("login")}>
              Byt till Log in
            </NavLink>
          </Form>
        </FormWrapper>
      </>
    );
  };

  const renderHomeContent = () => {
    return (
      <>
        <article className="home-aside-left">
          <h1>Välkommen till Yrgos Branschevent!</h1>
          <p>
            Där framtidens digitala designers och webbutvecklare möter
            branschen!
            <br></br>
            <br></br>
            Letar du efter en LIA-plats eller nya talanger? Här skapas
            möjligheter, nätverk och framtida samarbeten!
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
