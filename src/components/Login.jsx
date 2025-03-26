import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Form from "./Form";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    try {
      setError("");

      // Call your MongoDB backend to authenticate the user
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid email or password");
      }

      // Get user data including MongoDB _id
      const userData = await response.json();

      // Store user data in context and localStorage
      login({
        userId: userData._id,
        email: userData.email,
        userType: userData.userType,
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

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
        submitLabel="Login"
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
