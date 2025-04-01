import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Form from "./Form";
import ProfileImageUpload from "./ProfilePictureUpload";

// Import field data from a separate file (assuming they exist in FormData.js)
import { specializations, softwares, languages, stacks } from "./FormData";

export default function CreateStudentProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [courseId, setCourseId] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmitCreateStudentProfile = async (data) => {
    try {
      console.log("Raw form data:", JSON.stringify(data, null, 2));
      console.log("Form data received:", data); // @debug - see what's in the data

      // Create a base payload object
      const payload = {
        userId: currentUser.userId,
        name: data.name,
        courseId: data.courseId,
        portfolio: data.portfolio,
        linkedin: data.linkedin,
        profileImageUrl: profileImage,
      };

      console.log("Profile image URL:", profileImage); // @debug - check if profileImage has a value

      // Add course-specific fields based on the selected course
      if (data.courseId === "dd") {
        // Extract value property from select field objects
        payload.specialization = [
          data.specialization1?.value || data.specialization1,
          data.specialization2?.value || data.specialization2,
          data.specialization3?.value || data.specialization3,
        ].filter(Boolean); // Filter out any undefined values

        payload.software = [
          data.software1?.value || data.software1,
          data.software2?.value || data.software2,
          data.software3?.value || data.software3,
        ].filter(Boolean);
      } else if (data.courseId === "wu") {
        payload.stack = data.stack?.value || data.stack;
        payload.languages = [
          data.languages1?.value || data.languages1,
          data.languages2?.value || data.languages2,
          data.languages3?.value || data.languages3,
        ].filter(Boolean);
      }

      console.log("Sending payload:", payload); // Debug log

      const response = await fetch(
        `http://localhost:4000/api/create-studentProfile/${currentUser.userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create student profile"
        );
      }

      // Parse the response data
      let userData = null;
      if (response.status !== 204) {
        userData = await response.json();
        console.log("Received response:", userData); // Debug log
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Profile creation error:", error);
    }
  };

  const handleImageUploaded = (imageUrl) => {
    setProfileImage(imageUrl);
  };

  const handleRadioChange = (e) => {
    setCourseId(e.target.value);
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
      onChange: handleRadioChange, // Custom handler for radio changes
    },
  ];

  // Add course-specific fields based on courseId
  if (courseId === "dd") {
    fields = [
      ...fields,
      {
        type: "select",
        name: "specialization1",
        label: "Inriktning 1",
        required: false,
        options: specializations,
        placeholder: "Välj från listan",
      },
      {
        type: "select",
        name: "specialization2",
        label: "Inriktning 2",
        required: false,
        options: specializations,
        placeholder: "Välj från listan",
      },
      {
        type: "select",
        name: "specialization3",
        label: "Inriktning 3",
        required: false,
        options: specializations,
        placeholder: "Välj från listan",
      },
      {
        type: "select",
        name: "software1",
        label: "Designprogram 1",
        required: false,
        options: softwares,
        placeholder: "Välj från listan",
      },
      {
        type: "select",
        name: "software2",
        label: "Designprogram 2",
        required: false,
        options: softwares,
        placeholder: "Välj från listan",
      },
      {
        type: "select",
        name: "software3",
        label: "Designprogram 3",
        required: false,
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
        required: false,
        options: stacks,
        placeholder: "Välj från listan",
      },
      {
        type: "select",
        name: "languages1",
        label: "Språk/Ramverk 1",
        required: false,
        options: languages,
        placeholder: "Välj från listan",
      },
      {
        type: "select",
        name: "languages2",
        label: "Språk/Ramverk 2",
        required: false,
        options: languages,
        placeholder: "Välj från listan",
      },
      {
        type: "select",
        name: "languages3",
        label: "Språk/Ramverk 3",
        required: false,
        options: languages,
        placeholder: "Välj från listan",
      },
    ];
  }

  // Add common fields at the end
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
      <ProfileImageUpload onImageUploaded={handleImageUploaded} />
      {profileImage && (
        <div className="success-message">
          Profile image uploaded successfully!
        </div>
      )}
      <Form
        fields={fields}
        onSubmit={handleSubmitCreateStudentProfile}
        submitLabel="Register"
      />
    </div>
  );
}
