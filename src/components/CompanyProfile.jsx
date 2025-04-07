import { useState } from "react";
import { useProfile } from "./hooks/useProfile";
import Form from "./Form";
import TextField from "./fields/TextField";
import SelectField from "./fields/SelectField";
import TextareaField from "./fields/TextAreaField";
import ProfileImageUpload from "./ProfilePictureUpload";
import FormWrapper from "./FormWrapper";

// Define industry options
const industries = [
  { value: "tech", label: "Technology" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "consulting", label: "Consulting" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "media", label: "Media & Entertainment" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "other", label: "Other" },
];

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
    ? "Update Company Profile"
    : "Create Company Profile";

  return (
    <FormWrapper title={title}>
      {error && <div className="error-message">{error}</div>}

      <ProfileImageUpload
        onImageUploaded={handleImageUploaded}
        currentImage={profileImage}
      />

      <Form
        onSubmit={handleSubmitProfile}
        initialValues={initialFormData}
        submitLabel={existingProfile ? "Update Profile" : "Create Profile"}
        disabled={isLoading}
      >
        <FormWrapper title="Company Information" className="nested-form">
          <TextField
            name="companyName"
            label="Company Name"
            required={true}
            placeholder="Enter your company name"
          />

          <SelectField
            name="industry"
            label="Industry"
            required={true}
            options={industries}
            placeholder="Select your industry"
          />

          <TextField
            name="website"
            label="Company Website"
            placeholder="https://example.com"
          />

          <TextareaField
            name="description"
            label="Company Description"
            placeholder="Briefly describe your company"
            rows={5}
            maxLength={200}
            resizable={false}
          />
        </FormWrapper>

        <FormWrapper title="Contact Information" className="nested-form">
          <TextField
            name="contactPerson.name"
            label="Contact Person Name"
            required={true}
            placeholder="Enter contact person's name"
          />

          <TextField
            name="contactPerson.email"
            label="Contact Person Email"
            required={true}
            placeholder="contact@example.com"
            type="email"
          />
        </FormWrapper>

        <FormWrapper title="Internship Information" className="nested-form">
          <TextareaField
            name="internshipDetails"
            label="Internship Details"
            placeholder="Describe the internship opportunities"
            rows={4}
            maxLength={200}
            resizable={false}
          />
        </FormWrapper>
      </Form>
    </FormWrapper>
  );
}
