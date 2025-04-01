import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Form from "./Form";
import ProfileImageUpload from "./ProfilePictureUpload";

// Import field data from a separate file
import { specializations, softwares, languages, stacks } from "./FormData";

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [courseId, setCourseId] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [existingProfile, setExistingProfile] = useState(null);
  const [initialFormData, setInitialFormData] = useState({});

  // Fetch the user's existing profile when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/user-profile/${currentUser.userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();

        // If student profile exists, store it and set initial form values
        if (data.profile && data.user.userType === "student") {
          setExistingProfile(data.profile);

          // Set courseId for conditional rendering
          setCourseId(data.profile.courseId || "");

          // Set profile image URL if it exists
          if (data.profile.profileImageUrl) {
            setProfileImage(data.profile.profileImageUrl);
          }

          // Create initial form data object from existing profile
          const formData = {
            name: data.profile.name || "",
            courseId: data.profile.courseId || "",
            portfolio: data.profile.portfolio || "",
            linkedin: data.profile.linkedin || "",
          };

          console.log("Raw profile data:", data.profile);

          // Add course-specific fields if courseId is set
          if (data.profile.courseId === "dd") {
            // Add specialization fields as objects for react-select
            if (
              data.profile.specialization &&
              data.profile.specialization.length > 0
            ) {
              // Make sure we only use defined values and find matching option objects
              data.profile.specialization
                .filter(Boolean)
                .forEach((spec, index) => {
                  const option = specializations.find((s) => s.value === spec);
                  if (option && index < 3) {
                    formData[`specialization${index + 1}`] = option;
                  }
                });
            }

            // Add software fields as objects for react-select
            if (data.profile.software && data.profile.software.length > 0) {
              data.profile.software.filter(Boolean).forEach((sw, index) => {
                const option = softwares.find((s) => s.value === sw);
                if (option && index < 3) {
                  formData[`software${index + 1}`] = option;
                }
              });
            }
          } else if (data.profile.courseId === "wu") {
            // Add stack field as object for react-select
            if (data.profile.stack) {
              const stackOption = stacks.find(
                (s) => s.value === data.profile.stack
              );
              if (stackOption) {
                formData.stack = stackOption;
              }
            }

            // Add languages fields as objects for react-select
            if (data.profile.languages && data.profile.languages.length > 0) {
              data.profile.languages.filter(Boolean).forEach((lang, index) => {
                const option = languages.find((l) => l.value === lang);
                if (option && index < 3) {
                  formData[`languages${index + 1}`] = option;
                }
              });
            }
          }

          console.log("Initialized form data:", formData);
          setInitialFormData(formData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && currentUser.userId) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleSubmitStudentProfile = async (data) => {
    try {
      setError("");
      console.log("Form submission data:", data);
      console.log("Current user:", currentUser);
      console.log("Profile image URL:", profileImage);

      // Create a base payload object
      const payload = {
        userId: currentUser.userId,
        name: data.name,
        courseId: data.courseId,
        portfolio: data.portfolio || "",
        linkedin: data.linkedin || "", // Ensure linkedin is always included
        profileImageUrl: profileImage || "", // Ensure profileImageUrl is always included
      };

      // Add course-specific fields based on the selected course
      if (data.courseId === "dd") {
        // Extract value property from select field objects
        payload.specialization = [
          // Handle both object format and string format
          typeof data.specialization1 === "object"
            ? data.specialization1?.value
            : data.specialization1,
          typeof data.specialization2 === "object"
            ? data.specialization2?.value
            : data.specialization2,
          typeof data.specialization3 === "object"
            ? data.specialization3?.value
            : data.specialization3,
        ].filter(Boolean); // Filter out any undefined or null values

        payload.software = [
          typeof data.software1 === "object"
            ? data.software1?.value
            : data.software1,
          typeof data.software2 === "object"
            ? data.software2?.value
            : data.software2,
          typeof data.software3 === "object"
            ? data.software3?.value
            : data.software3,
        ].filter(Boolean);
      } else if (data.courseId === "wu") {
        // Handle both object format and string format for stack
        payload.stack =
          typeof data.stack === "object" ? data.stack?.value : data.stack;

        payload.languages = [
          typeof data.languages1 === "object"
            ? data.languages1?.value
            : data.languages1,
          typeof data.languages2 === "object"
            ? data.languages2?.value
            : data.languages2,
          typeof data.languages3 === "object"
            ? data.languages3?.value
            : data.languages3,
        ].filter(Boolean);
      }

      console.log("Submitting payload:", payload);

      // Determine whether to create or update profile
      const endpoint = existingProfile
        ? `http://localhost:4000/api/update-studentProfile/${currentUser.userId}`
        : `http://localhost:4000/api/create-studentProfile/${currentUser.userId}`;

      const method = existingProfile ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save student profile");
      }

      // Show success message
      alert("Profile saved successfully!");

      // Navigate to dashboard on success
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Profile save error:", error);
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

  if (isLoading) {
    return <div className="loading">Loading profile data...</div>;
  }

  return (
    <div className="studentProfile-container">
      <h2>{existingProfile ? "Uppdatera din profil" : "Skapa din profil"}</h2>

      {error && <div className="error-message">{error}</div>}

      <ProfileImageUpload
        onImageUploaded={handleImageUploaded}
        currentImage={profileImage}
      />

      {profileImage && (
        <div className="profile-preview">
          <h3>Din profilbild</h3>
          <img
            src={profileImage}
            alt="Profile preview"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      <Form
        fields={fields}
        onSubmit={handleSubmitStudentProfile}
        submitLabel={existingProfile ? "Spara ändringar" : "Skapa profil"}
        initialValues={initialFormData}
      />
    </div>
  );
}
