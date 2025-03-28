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

      const response = await fetch("http://localhost:4000/api/login", {
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

      login({
        userId: responseData._id,
        email: responseData.email,
        userType: responseData.userType,
      });

      navigate("/dashboard");
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
