import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Form from "./Form";
import ProfileImageUpload from "./ProfilePictureUpload";

// Define industry options (you could move this to FormData.jsx)
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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [existingProfile, setExistingProfile] = useState(null);
  const [initialFormData, setInitialFormData] = useState({});

  // Extract the fetch function for reusability
  const fetchCompanyProfile = async () => {
    if (!currentUser || !currentUser.userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Fetching company profile for user:", currentUser.userId);

      const response = await fetch(
        `http://localhost:4000/api/user-profile/${currentUser.userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch company profile");
      }

      const data = await response.json();
      console.log("Retrieved profile data:", data);

      // If company profile exists, store it and set initial form values
      if (data.profile && data.user.userType === "company") {
        setExistingProfile(data.profile);

        // Set profile image URL if it exists
        if (data.profile.profileImageUrl) {
          console.log("Setting profile image:", data.profile.profileImageUrl);
          setProfileImage(data.profile.profileImageUrl);
        }

        // Create initial form data object from existing profile
        const formData = {
          companyName: data.profile.companyName || "",
          industry:
            industries.find((ind) => ind.value === data.profile.industry) ||
            null,
          description: data.profile.description || "",
          website: data.profile.website || "",
          "contactPerson.name": data.profile.contactPerson?.name || "",
          "contactPerson.email": data.profile.contactPerson?.email || "",
          internshipDetails: data.profile.internshipDetails || "",
        };

        console.log("Initialized company form data:", formData);
        setInitialFormData(formData);
      } else {
        console.log("No existing company profile found or user type mismatch");
      }
    } catch (error) {
      console.error("Error fetching company profile:", error);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch existing company profile when component mounts
  useEffect(() => {
    fetchCompanyProfile();
  }, [currentUser]);

  const handleSubmitCompanyProfile = async (data) => {
    try {
      setError("");
      console.log("Form submission data:", data);

      // Create the payload object
      const payload = {
        userId: currentUser.userId,
        companyName: data.companyName,
        industry:
          typeof data.industry === "object"
            ? data.industry.value
            : data.industry,
        description: data.description || "",
        website: data.website || "",
        contactPerson: {
          name: data["contactPerson.name"],
          email: data["contactPerson.email"],
        },
        internshipDetails: data.internshipDetails || "",
        profileImageUrl: profileImage || "",
      };

      console.log(
        "Submitting payload with profileImageUrl:",
        payload.profileImageUrl
      );

      // Determine whether to create or update profile
      const endpoint = existingProfile
        ? `http://localhost:4000/api/update-companyProfile/${currentUser.userId}`
        : `http://localhost:4000/api/create-companyProfile/${currentUser.userId}`;

      const method = existingProfile ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save company profile");
      }

      // Get the response data
      const responseData = await response.json();
      console.log("Profile saved successfully:", responseData);

      // Refresh the profile data
      await fetchCompanyProfile();

      // Show success message
      alert("Company profile saved successfully!");

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

  // Define form fields
  const fields = [
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
    <div className="companyProfile-container">
      <h2>
        {existingProfile ? "Update Company Profile" : "Create Company Profile"}
      </h2>

      {error && <div className="error-message">{error}</div>}

      <ProfileImageUpload
        onImageUploaded={handleImageUploaded}
        currentImage={profileImage}
      />

      {profileImage && (
        <div className="profile-preview">
          <h3>Company Logo</h3>
          <img
            src={profileImage}
            alt="Company logo preview"
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
        onSubmit={handleSubmitCompanyProfile}
        submitLabel={existingProfile ? "Update Profile" : "Create Profile"}
        initialValues={initialFormData}
      />
    </div>
  );
}
