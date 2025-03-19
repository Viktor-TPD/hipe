import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Form from "./components/Form";

function App() {
  const handleSubmit = (data) => {
    console.log("Form data:", data);
    // @JULIA sends to Node backend
    fetch("/api/submit-form", {
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
          { type: "name", name: "name", required: true },
          { type: "email", name: "email", required: true },
          { type: "checkbox", name: "Course", label: "Course:" },
        ]}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
