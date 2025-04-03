import { useState, useEffect } from "react";
import { useProfile } from "./hooks/useProfile";
import ProfileForm from "./ProfileForm";
import { specializations, softwares, languages, stacks } from "./FormData";
import RadioField from "./fields/RadioField";

export default function StudentProfile() {
  const [courseId, setCourseId] = useState("");

  // Transform API data to form format
  const transformInitialData = (profileData) => {
    const formData = {
      name: profileData.name || "",
      description: profileData.description || "",
      courseId: profileData.courseId || "",
      portfolio: profileData.portfolio || "",
      linkedin: profileData.linkedin || "",
    };

    // Set courseId for conditional field rendering
    setCourseId(profileData.courseId || "");

    // Add course-specific fields
    if (profileData.courseId === "dd") {
      // Add specialization fields
      if (profileData.specialization && profileData.specialization.length > 0) {
        profileData.specialization.filter(Boolean).forEach((spec, index) => {
          const option = specializations.find((s) => s.value === spec);
          if (option && index < 3) {
            formData[`specialization${index + 1}`] = option;
          }
        });
      }

      // Add software fields
      if (profileData.software && profileData.software.length > 0) {
        profileData.software.filter(Boolean).forEach((sw, index) => {
          const option = softwares.find((s) => s.value === sw);
          if (option && index < 3) {
            formData[`software${index + 1}`] = option;
          }
        });
      }
    } else if (profileData.courseId === "wu") {
      // Add stack field
      if (profileData.stack) {
        const stackOption = stacks.find((s) => s.value === profileData.stack);
        if (stackOption) {
          formData.stack = stackOption;
        }
      }

      // Add languages fields
      if (profileData.languages && profileData.languages.length > 0) {
        profileData.languages.filter(Boolean).forEach((lang, index) => {
          const option = languages.find((l) => l.value === lang);
          if (option && index < 3) {
            formData[`languages${index + 1}`] = option;
          }
        });
      }
    }

    return formData;
  };

  // Transform form data to API format
  const transformSubmitData = (formData) => {
    const payload = {
      name: formData.name,
      description: formData.description || "",
      courseId: formData.courseId,
      portfolio: formData.portfolio || "",
      linkedin: formData.linkedin || "",
    };

    // Add course-specific fields
    if (formData.courseId === "dd") {
      payload.specialization = [
        typeof formData.specialization1 === "object"
          ? formData.specialization1?.value
          : formData.specialization1,
        typeof formData.specialization2 === "object"
          ? formData.specialization2?.value
          : formData.specialization2,
        typeof formData.specialization3 === "object"
          ? formData.specialization3?.value
          : formData.specialization3,
      ].filter(Boolean);

      payload.software = [
        typeof formData.software1 === "object"
          ? formData.software1?.value
          : formData.software1,
        typeof formData.software2 === "object"
          ? formData.software2?.value
          : formData.software2,
        typeof formData.software3 === "object"
          ? formData.software3?.value
          : formData.software3,
      ].filter(Boolean);
    } else if (formData.courseId === "wu") {
      payload.stack =
        typeof formData.stack === "object"
          ? formData.stack?.value
          : formData.stack;

      payload.languages = [
        typeof formData.languages1 === "object"
          ? formData.languages1?.value
          : formData.languages1,
        typeof formData.languages2 === "object"
          ? formData.languages2?.value
          : formData.languages2,
        typeof formData.languages3 === "object"
          ? formData.languages3?.value
          : formData.languages3,
      ].filter(Boolean);
    }

    return payload;
  };

  // Use our custom hook
  const {
    isLoading,
    error,
    profileImage,
    existingProfile,
    initialFormData,
    handleSubmitProfile,
    handleImageUploaded,
  } = useProfile({
    profileType: "student",
    transformInitialData,
    transformSubmitData,
  });

  // Handle course selection change
  const handleRadioChange = (e) => {
    console.log(e)
    setCourseId(e.target.value);

  };

<<<<<<< HEAD
  // Define the form fields based on the selected course
  const getFormFields = () => {
    // Base fields that are always shown
    let fields = [
      {
        type: "text",
        name: "name",
        label: "Full Name",
        required: true,
        placeholder: "Enter your full name",
      },
      {
        type: "textarea",
        name: "description",
        label: "About Me",
        required: false,
        placeholder: "Tell us a bit about yourself...",
        rows: 5,
        maxLength: 200,
      },
      {
        type: "radio",
        name: "courseId",
        label: "Course",
        required: true,
        options: [
          { value: "wu", label: "Web Development" },
          { value: "dd", label: "Digital Design" },
        ],
        onChange: handleRadioChange,
      },
    ];
=======
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
      type: "textarea", // New description field
      name: "description",
      label: "Om mig",
      required: false,
      placeholder: "Berätta lite om dig själv...",
      rows: 5,
      maxLength: 200,
    },
    // {
    //   type: "radio",
    //   name: "courseId",
    //   label: "Utbildning",
    //   required: true,
    //   options: [
    //     { value: "wu", label: "WU" },
    //     { value: "dd", label: "DD" },
    //   ],
    //   onChange: handleRadioChange, // Custom handler for radio changes
    // },
  ];
>>>>>>> julia-merge-dev

    // Add course-specific fields
    if (courseId === "dd") {
      fields = [
        ...fields,
        {
          type: "select",
          name: "specialization1",
          label: "Specialization 1",
          required: false,
          options: specializations,
          placeholder: "Select from list",
        },
        {
          type: "select",
          name: "specialization2",
          label: "Specialization 2",
          required: false,
          options: specializations,
          placeholder: "Select from list",
        },
        {
          type: "select",
          name: "specialization3",
          label: "Specialization 3",
          required: false,
          options: specializations,
          placeholder: "Select from list",
        },
        {
          type: "select",
          name: "software1",
          label: "Design Software 1",
          required: false,
          options: softwares,
          placeholder: "Select from list",
        },
        {
          type: "select",
          name: "software2",
          label: "Design Software 2",
          required: false,
          options: softwares,
          placeholder: "Select from list",
        },
        {
          type: "select",
          name: "software3",
          label: "Design Software 3",
          required: false,
          options: softwares,
          placeholder: "Select from list",
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
          placeholder: "Select your stack",
        },
        {
          type: "select",
          name: "languages1",
          label: "Language/Framework 1",
          required: false,
          options: languages,
          placeholder: "Select from list",
        },
        {
          type: "select",
          name: "languages2",
          label: "Language/Framework 2",
          required: false,
          options: languages,
          placeholder: "Select from list",
        },
        {
          type: "select",
          name: "languages3",
          label: "Language/Framework 3",
          required: false,
          options: languages,
          placeholder: "Select from list",
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
        required: false,
        placeholder: "URL to your portfolio or GitHub",
      },
      {
        type: "text",
        name: "linkedin",
        label: "LinkedIn",
        required: false,
        placeholder: "URL to your LinkedIn profile",
      },
    ];

    return fields;
  };

  if (isLoading) {
    return <div className="loading">Loading profile data...</div>;
  }

  return (
<<<<<<< HEAD
    <ProfileForm
      title={
        existingProfile ? "Update Student Profile" : "Create Student Profile"
      }
      fields={getFormFields()}
      onSubmit={handleSubmitProfile}
      initialValues={initialFormData}
      error={error}
      profileImage={profileImage}
      onImageUploaded={handleImageUploaded}
      isUpdateMode={!!existingProfile}
      isLoading={isLoading}
    />
=======
    <div className="studentProfile-container">
      <h2>{existingProfile ? "Uppdatera din profil" : "Skapa din profil"}</h2>

      {error && <div className="error-message">{error}</div>}

      <RadioField options={[
        { value: "dd", label: "DD" },
    { value: "wu", label: "WU" }
  ]} onChange={handleRadioChange} name="courseId" className="courseId"></RadioField>

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
>>>>>>> julia-merge-dev
  );
}
