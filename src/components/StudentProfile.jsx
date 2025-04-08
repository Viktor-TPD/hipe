import { useState, useEffect } from "react";
import { useProfile } from "./hooks/useProfile";
import Form from "./Form";
import TextField from "./fields/TextField";
import RadioField from "./fields/RadioField";
import SelectField from "./fields/SelectField";
import TextareaField from "./fields/TextAreaField";
import ProfileImageUpload from "./ProfilePictureUpload";
import FormWrapper from "./FormWrapper";
import { specializations, softwares, languages, stacks } from "./FormData";
import "./../styles/styles.css";
import "./../styles/form.css";
import "./../styles/imageUpload.css";

export default function StudentProfile() {
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState("");

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

  const handleCourseSelection = (e) => {
    setCourseId(e.target.value);
  };

  if (isLoading) {
    return <div className="loading">Loading profile data...</div>;
  }

  const title = existingProfile
    ? "Uppdatera Studentprofil"
    : "Skapa Studentprofil";

  return (
    <>

      <h1>{title}</h1>
    <article>
      {error && <div className="error-message">{error}</div>}

      <FormWrapper className="image-form-wrapper">
        <ProfileImageUpload
          onImageUploaded={handleImageUploaded}
          currentImage={profileImage}
          />
      </FormWrapper>

      <FormWrapper className="about-me-form-wrapper">
        <Form
          onSubmit={handleSubmitProfile}
          initialValues={initialFormData}
          submitLabel={"Spara"}
          disabled={isLoading}
          >
          <h3>Om mig</h3>
          <TextField
            name="name"
            label="För- och efternamn"
            required={true}
            placeholder="Namn"
            />

          <TextareaField
            name="description"
            label="Beskrivning"
            placeholder="Beskrivning"
            rows={5}
            maxLength={200}
            />
          <FormWrapper />

          <RadioField
            name="courseId"
            label="Course"
            required={true}
            options={[
              { value: "dd", label: "DD" },
              { value: "wu", label: "WU" },
            ]}
            onValueChange={handleCourseSelection}
            />

          {courseId === "dd" && (
            <FormWrapper className="course-specific-wrapper">
              <SelectField
                name="specialization1"
                label="Specialization 1"
                options={specializations}
                placeholder="Select from list"
                />

              <SelectField
                name="specialization2"
                label="Specialization 2"
                options={specializations}
                placeholder="Select from list"
                />

              <SelectField
                name="specialization3"
                label="Specialization 3"
                options={specializations}
                placeholder="Select from list"
                />

              <SelectField
                name="software1"
                label="Design Software 1"
                options={softwares}
                placeholder="Select from list"
                />

              <SelectField
                name="software2"
                label="Design Software 2"
                options={softwares}
                placeholder="Select from list"
                />

              <SelectField
                name="software3"
                label="Design Software 3"
                options={softwares}
                placeholder="Select from list"
                />
            </FormWrapper>
          )}
          
          {courseId === "wu" && (
            <FormWrapper className="course-specific-wrapper">
              <h3>Techstack</h3>
              <SelectField
                name="stack"
                label="Stack"
                options={stacks}
                placeholder="Select your stack"
                />

              <h3>Språk/ramverk</h3>
              <SelectField
                name="languages1"
                label="Language/Framework 1"
                options={languages}
                placeholder="Select from list"
                />

              <SelectField
                name="languages2"
                label="Language/Framework 2"
                options={languages}
                placeholder="Select from list"
                />

              <SelectField
                name="languages3"
                label="Language/Framework 3"
                options={languages}
                placeholder="Select from list"
                />
            </FormWrapper>
          )}

          <FormWrapper className="social-wrapper">
            <TextField
              name="portfolio"
              label="Portfolio/GitHub"
              placeholder="URL to your portfolio or GitHub"
              />

            <TextField
              name="linkedin"
              label="LinkedIn"
              placeholder="URL to your LinkedIn profile"
              />
          </FormWrapper>
        </Form>
      </FormWrapper>
      <FormWrapper className="visited-company-wrapper">

      </FormWrapper>
              </article>
    </>
  );
}
