import { useState } from "react";
import { useProfile } from "./hooks/useProfile";
import Form from "./Form";
import TextField from "./fields/TextField";
import SelectField from "./fields/SelectField";
import TextareaField from "./fields/TextAreaField";
import ProfileImageUpload from "./ProfilePictureUpload";
import FormWrapper from "./FormWrapper";
import "./../styles/styles.css";
import "./../styles/form.css";
import "./../styles/imageUpload.css";


export default function CompanyProfile() {
  const [error, setError] = useState("");

  // Transform API data to form format
  const transformInitialData = (profileData) => {
    return {
      companyName: profileData.companyName || "",
      industry:
        industries.find((ind) => ind.value === profileData.industry) || null,
      description: profileData.description || "",
      website: profileData.website || "",
      "contactPerson.name": profileData.contactPerson?.name || "",
      "contactPerson.email": profileData.contactPerson?.email || "",
      internshipDetails: profileData.internshipDetails || "",
    };
  };

  // Transform form data to API format
  const transformSubmitData = (formData) => {
    return {
      companyName: formData.companyName,
      industry:
        typeof formData.industry === "object"
          ? formData.industry.value
          : formData.industry,
      description: formData.description || "",
      website: formData.website || "",
      contactPerson: {
        name: formData["contactPerson.name"],
        email: formData["contactPerson.email"],
      },
      internshipDetails: formData.internshipDetails || "",
    };
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
    profileType: "company",
    transformInitialData,
    transformSubmitData,
  });

  if (isLoading) {
    return <div className="loading">Loading profile data...</div>;
  }

  const title = existingProfile
    ? "Uppadtera Företagsprofil"
    : "Skapa Företagsprofil";

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
      <h3>Allmänt om företaget</h3>
      <Form
        onSubmit={handleSubmitProfile}
        initialValues={initialFormData}
        submitLabel={"Spara"}
        disabled={isLoading}
        >
        <FormWrapper  className="nested-form">
          <TextField
            name="companyName"
            label="Företagsnamn"
            required={true}
            placeholder="Namn"
            />

          <TextField
            name="industry"
            label="Företagsinriktning"
            required={true}
            placeholder="Webbyrå"
            />

          <TextareaField
            name="description"
            label="Company Description"
            placeholder="Beskrivning"
            rows={5}
            maxLength={200}
            resizable={false}
            />
          <h3>LIA</h3>
            <TextField
              name="internshipDetails"
              label="LIA-platser tillgängliga"
              placeholder="Platser"
              />

        </FormWrapper>

        <FormWrapper className="nested-form">
          <h3>Kontaktperson</h3>
          <TextField
            name="contactPerson.name"
            label="Namn"
            required={true}
            placeholder="Namn"
            />

          <TextField
            name="contactPerson.email"
            label="Email"
            required={true}
            placeholder="Email"
            type="email"
            />
        </FormWrapper>

        <FormWrapper className="nested-form">
          <TextField
            name="website"
            label="Company Website"
            placeholder="Länk"
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
