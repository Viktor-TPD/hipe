import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Form from "./Form";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setError("");
      setIsLoading(true);

      const response = await fetch("http://localhost:4000/api/v1/auth/login", {
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

      // Access user data from the data property
      const userData = responseData.data;

      login({
        userId: userData._id,
        email: userData.email,
        userType: userData.userType,
      });

      console.log("this is my usertype " + userData.userType);

      if (userData.userType === "student") {
        console.log("hej");
        navigate("/create-studentProfile/");
      } else if (userData.userType === "company") {
        navigate("/create-companyProfile/");
      } else {
        console.log("wrong user type: " + userData.userType);
      }
    } catch (error) {
      setError(error.message || "Failed to login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>

      {error && <div className="error-message">{error}</div>}

      <Form
        fields={[
          {
            type: "email",
            name: "email",
            label: "Email",
            required: true,
            placeholder: "Enter your email",
            autoComplete: "email",
          },
          {
            type: "password",
            name: "password",
            label: "Password",
            required: true,
            placeholder: "Enter your password",
            autoComplete: "current-password",
          },
        ]}
        onSubmit={handleSubmit}
        submitLabel={isLoading ? "Logging in..." : "Login"}
        disabled={isLoading}
      />

      <div className="form-footer">
        <p>
          Don't have an account?{" "}
          <button className="link-button" onClick={() => navigate("/register")}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
