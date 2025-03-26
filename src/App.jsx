import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Form from "./components/Form";
import Dashboard from "./components/Dashboard";

function App() {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    console.log("Form data:", data); //@debug

    setUserType(data.userType);

    // TO BACKEND @JULIA, NOTE: make this dynamic?
    fetch("http://localhost:4000/api/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    navigate(`/dashboard?userType=${data.userType}`);
  };

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>User Registration</h1>
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
                    placeholder: "Enter your password",
                  },
                  {
                    type: "radio",
                    name: "userType",
                    label: "Are you a student or a company?",
                    required: true,
                    options: [
                      { value: "student", label: "Student" },
                      { value: "company", label: "Company" },
                    ],
                  },
                ]}
                onSubmit={handleSubmit}
              />
            </>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
