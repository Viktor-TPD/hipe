import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Form from "./Form";

// Import field data from a separate file (assuming they exist in FormData.js)
// If not, you can define these arrays directly in this file
import { specializations, softwares, languages, stacks } from "./FormData";

export default function CreateStudentProfile() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [courseId, setCourseId] = useState(""); 

  const handleRadioChange = (e) => {
    setCourseId(e.target.value);
  };

  const handleSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:4000/api/create-studentProfile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          courseId: data.courseId,
          specialization: data.specialization,
          software: data.software,
          portfolio: data.portfolio,
          linkedin: data.linkedin
        }),
      });

      if (response.ok) {
        const userData = response.status !== 204 ? await response.json() : null;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create student profile");
      }

      // Get the created user data with MongoDB _id
      const userData = await response.json();

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      // @todo Better error handling for user?
      setError(error.message);
      console.error("Registration error:", error);
    }
  };

  // Start with the base fields that are always shown
  let fields = [
    {
      type: "text",
      name: "name",
      label: "Fullständigt namn",
      required: true,
      placeholder: "Namn",
    },
    {
      type: "radio",
      name: "courseId",
      label: "Utbildning",
      required: true,
      options: [
        { value: "wu", label: "WU" },
        { value: "dd", label: "DD" },
      ],
      onChange: handleRadioChange,  // Custom handler for radio changes
    }
  ];

  // Add course-specific fields based on courseId
  if (courseId === "dd") {
    fields = [
      ...fields,
      {
        type: "select",
        name: "specialization",
        label: "Inriktning 1",
        required: true,
        options: specializations,
        placeholder: "Välj från listan",
      },
      {
        type: "select",
        name: "software",
        label: "Designprogram 1",
        required: true,
        options: softwares,
        placeholder: "Välj från listan",
      },
    ];
  } else if (courseId === "wu") {
    fields = [
      ...fields,
      {
        type: "select",
        name: "stack",
        label: "Stack",
        required: true,
        options: stacks,
        placeholder: "Välj från listan",
      },
      {
        type: "select",
        name: "languages",
        label: "Språk/Ramverk 1",
        required: true,
        options: languages,
        placeholder: "Välj från listan",
      },
    ];
  }


  fields = [
    ...fields,
    {
      type: "text",
      name: "portfolio",
      label: "Portfolio/GitHub",
      required: true,
      placeholder: "Länk",
    },
    {
      type: "text",
      name: "linkedin",
      label: "LinkedIn",
      required: true,
      placeholder: "Länk",
    },
  ];

  return (
    <div className="studentProfile-container">
      <h2>Redigera studentprofil</h2>
      {error && <div className="error-message">{error}</div>}
      <Form
       
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel="Register"
      />
    </div>
  );
}