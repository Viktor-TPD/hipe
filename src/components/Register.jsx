import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Form from "./Form";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    try {
      setError("");

      // Validate password
      if (data.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      // Check if passwords match
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Create new user in MongoDB
      const response = await fetch("http://localhost:4000/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          userType: data.userType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // Get the created user data with MongoDB _id
      const userData = await response.json();

      // Log the user in
      login({
        userId: userData._id,
        email: userData.email,
        userType: userData.userType,
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>

      {error && <div className="error-message">{error}</div>}

      <Form
        fields={[
          {
            type: "email",
            name: "email",
            label: "Email Address",
            required: true,
            placeholder: "Enter your email",
            autoComplete: "email",
          },
          {
            type: "password",
            name: "password",
            label: "Password",
            required: true,
            placeholder: "Create a password",
            autoComplete: "new-password",
          },
          {
            type: "password",
            name: "confirmPassword",
            label: "Confirm Password",
            required: true,
            placeholder: "Confirm your password",
            autoComplete: "new-password",
          },
          {
            type: "radio",
            name: "userType",
            label: "Account Type",
            required: true,
            options: [
              { value: "student", label: "Student" },
              { value: "company", label: "Company" },
            ],
          },
        ]}
        onSubmit={handleSubmit}
        submitLabel="Register"
      />

      <div className="form-footer">
        <p>
          Already have an account?{" "}
          <button className="link-button" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
