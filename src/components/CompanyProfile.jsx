import { useState } from "react";
import { useProfile } from "./hooks/useProfile";
import Form from "./Form";
import TextField from "./fields/TextField";
import SelectField from "./fields/SelectField";
import TextareaField from "./fields/TextAreaField";
import ProfileImageUpload from "./ProfilePictureUpload";
import FormWrapper from "./FormWrapper";
import "./../styles/form.css";
import "./../styles/button.css";
import "./../styles/imageUpload.css";

export default function CompanyProfile() {
  const [error, setError] = useState("");

  const transformInitialData = (profileData) => {
    return {
      companyName: profileData.companyName || "",
      industry: profileData.industry || null,
      description: profileData.description || "",
      website: profileData.website || "",
      "contactPerson.name": profileData.contactPerson?.name || "",
      "contactPerson.email": profileData.contactPerson?.email || "",
      internshipDetails: profileData.internshipDetails || "",
    };
  };

  const transformSubmitData = (formData) => {
    return {
      companyName: formData.companyName,
      industry: formData.industry,
      description: formData.description || "",
      website: formData.website || "",
      contactPerson: {
        name: formData["contactPerson.name"],
        email: formData["contactPerson.email"],
      },
      internshipDetails: formData.internshipDetails || "",
    };
  };

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
    ? "Uppdatera Företagsprofil"
    : "Skapa Företagsprofil";

  return (
    <>
      <h1>{title}</h1>
      <article>
        {error && <div className="error-message">{error}</div>}

        <FormWrapper className="image-form-wrapper">
          <h3>Profilbild</h3>
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
            <FormWrapper className="nested-form">
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
                label="Beskrivning"
                placeholder="Beskrivning"
                rows={5}
                maxLength={200}
                resizable={false}
              />
            </FormWrapper>

            <FormWrapper>
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
              <TextField name="website" label="Hemsida" placeholder="Länk" />
            </FormWrapper>
          </Form>
          <p>
            Vill du att vi tar bort dina användaruppgifter? Kontakta oss på
            jullyn0722@skola.goteborg.se eller viktoh0812@skola.goteborg.se
          </p>
        </FormWrapper>
        <FormWrapper className="visited-company-wrapper"></FormWrapper>
      </article>
    </>
  );
}
