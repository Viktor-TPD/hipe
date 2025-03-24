import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Form from "./components/Form";

function App() {
  const handleSubmit = (data) => {
    console.log("Form data:", data);
    // TO BACKEND @JULIA, NOTE: make this dynamic?
    fetch("http://localhost:4000/api/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="app">
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
    </div>
  );


}

export default App;
