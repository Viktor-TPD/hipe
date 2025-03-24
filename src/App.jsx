import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Form from "./components/Form";

function App() {
  const handleSubmit = (data) => {
    console.log("Form data:", data);
    // TO BACKEND @JULIA, NOTE: make this dynamic?
    fetch("http://localhost:4000/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="app">
      <h1>User Information</h1>
      <Form
        fields={[
          {
            type: "text",
            name: "name",
            label: "Full Name",
            required: true,
            placeholder: "Enter your full name",
          },
          {
            type: "email",
            name: "email",
            label: "Email Address",
            required: true,
            placeholder: "Enter your email",
            autoComplete: "email",
          },
          // @todo DELETE ME LATER, EXAMPLE OF A DROPDOWN MENU BELOW
          // {
          //   type: "select",
          //   name: "course",
          //   label: "Select Course",
          //   required: true,
          //   options: [
          //     { value: "react", label: "React Fundamentals" },
          //     { value: "node", label: "Node.js Basics" },
          //     { value: "javascript", label: "Advanced JavaScript" },
          //   ],
          // },
          {
            type: "radio",
            name: "course",
            label: "Select your course",
            required: true,
            options: [
              { value: "dd", label: "Digital Design" },
              { value: "wu", label: "Webbutveckling" },
            ],
          },
          //comment out for test /j
          // {
          //   type: "checkbox",
          //   name: "gdpr",
          //   label: "I agree with the terms & conditions",
          // },
        ]}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
