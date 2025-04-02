import { useProfile } from "./hooks/useProfile";
import ProfileForm from "./ProfileForm";

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
    error,
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

  // Define form fields for company profile
  const getFormFields = () => [
    {
      type: "text",
      name: "companyName",
      label: "Company Name",
      required: true,
      placeholder: "Enter your company name",
    },
    {
      type: "select",
      name: "industry",
      label: "Industry",
      required: true,
      options: industries,
      placeholder: "Select your industry",
    },
    {
      type: "text",
      name: "website",
      label: "Company Website",
      required: false,
      placeholder: "https://example.com",
    },
    {
      type: "textarea",
      name: "description",
      label: "Company Description",
      required: false,
      placeholder: "Briefly describe your company",
      rows: 5,
      maxLength: 200,
      resizeable: false,
    },
    {
      type: "text",
      name: "contactPerson.name",
      label: "Contact Person Name",
      required: true,
      placeholder: "Enter contact person's name",
    },
    {
      type: "text",
      name: "contactPerson.email",
      label: "Contact Person Email",
      required: true,
      placeholder: "contact@example.com",
    },
    {
      type: "text",
      name: "internshipDetails",
      label: "Internship Details",
      required: false,
      placeholder: "Briefly describe the internship opportunities",
    },
  ];

  if (isLoading) {
    return <div className="loading">Loading profile data...</div>;
  }

  return (
    <ProfileForm
      title={
        existingProfile ? "Update Company Profile" : "Create Company Profile"
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
  );
}
