import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Form from "./Form";
import { API_BASE_URL } from "./config";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setError("");
      setIsLoading(true);

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

      // Create new user in MongoDB using the new RESTful endpoint
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          userType: data.userType,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      // Get the user data from the nested data property
      const userData = responseData.data;

      if (!userData) {
        throw new Error("Invalid response format from server");
      }

      // Log the user in
      login({
        userId: userData._id,
        email: userData.email,
        userType: userData.userType,
      });

      console.log("User type:", userData.userType);

      // Navigate based on user type
      if (userData.userType === "student") {
        navigate("/create-studentProfile/");
      } else if (userData.userType === "company") {
        navigate("/create-companyProfile/");
      } else {
        console.error("Unknown user type:", userData.userType);
      }
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
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
        submitLabel={isLoading ? "Registering..." : "Register"}
        disabled={isLoading}
      />

      <div className="form-footer">
        <p>
          Already have an account?{" "}
          <button className="link-button" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>

      {/* @todo Remove this when done testing vvv */}
      <div className="form-footer">
        <p>
          Trying out our buttons?{" "}
          <button
            className="link-button"
            onClick={() => navigate("/input-test")}
          >
            Do it here
          </button>
        </p>
      </div>
      {/* @todo Remove this when done testing ^^^ */}
    </div>
  );
}
