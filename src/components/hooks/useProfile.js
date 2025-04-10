import { useState, useEffect } from "react";
import { useAuth } from "./../../AuthContext";
import { useNotification } from "./../../NotificationContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./../../config";

/**
 * Custom hook for managing profile data (student or company)
 *
 * @param {Object} options Configuration options
 * @param {string} options.profileType Type of profile ('student' or 'company')
 * @param {Function} options.transformInitialData Function to transform API data to form data
 * @param {Function} options.transformSubmitData Function to transform form data to API payload
 * @returns {Object} Profile state and handlers
 */
export function useProfile({
  profileType,
  transformInitialData,
  transformSubmitData,
}) {
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [existingProfile, setExistingProfile] = useState(null);
  const [initialFormData, setInitialFormData] = useState({});

  // Determine API endpoints based on profile type
  const endpoints = {
    create: `${API_BASE_URL}/api/v1/${
      profileType === "student" ? "students" : "companies"
    }`,
    update: `${API_BASE_URL}/api/v1/${
      profileType === "student" ? "students" : "companies"
    }/${currentUser?.userId}`,
    fetch: `${API_BASE_URL}/api/v1/users/${currentUser?.userId}/profile`,
  };

  // Fetch existing profile data
  const fetchProfileData = async () => {
    if (!currentUser || !currentUser.userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log(
        `Fetching ${profileType} profile for user:`,
        currentUser.userId
      );

      const response = await fetch(endpoints.fetch);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${profileType} profile`);
      }

      const data = await response.json();
      console.log("Retrieved profile data:", data);

      // Check if we have a successful response with data
      if (!data.success || !data.data) {
        throw new Error(`Invalid response format for ${profileType} profile`);
      }

      // If profile exists and user type matches
      if (data.data.profile && data.data.user.userType === profileType) {
        setExistingProfile(data.data.profile);

        // Set profile image if it exists
        if (data.data.profile.profileImageUrl) {
          setProfileImage(data.data.profile.profileImageUrl);
        }

        // Transform data from API format to form format
        const formData = transformInitialData(data.data.profile);

        console.log(`Initialized ${profileType} form data:`, formData);
        setInitialFormData(formData);
      } else {
        console.log(
          `No existing ${profileType} profile found or user type mismatch`
        );
      }
    } catch (error) {
      console.error(`Error fetching ${profileType} profile:`, error);
      setError(`Failed to load profile data. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit profile data (create or update)
  const handleSubmitProfile = async (formData) => {
    try {
      setError("");
      console.log("Form submission data:", formData);

      // Transform form data to API payload
      const payload = {
        ...transformSubmitData(formData),
        userId: currentUser.userId,
        profileImageUrl: profileImage || "",
      };

      console.log("Submitting payload:", payload);

      // Determine whether to create or update
      const endpoint = existingProfile ? endpoints.update : endpoints.create;
      const method = existingProfile ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to save ${profileType} profile`
        );
      }

      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error(
          `Failed to save ${profileType} profile: ${responseData.message}`
        );
      }

      // Show success notification
      const successMessage = existingProfile
        ? `${
            profileType === "student" ? "Student" : "Company"
          } profile updated successfully`
        : `${
            profileType === "student" ? "Student" : "Company"
          } profile created successfully`;

      showNotification(successMessage, "success");

      // Navigate to dashboard
      navigate("/profile");
    } catch (error) {
      setError(error.message);
      showNotification(error.message, "error");
      console.error("Profile save error:", error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      setError("");

      // Create form data
      const formData = new FormData();
      formData.append("profileImage", file);

      // Upload image using new endpoint
      const response = await fetch(
        `${API_BASE_URL}/api/v1/uploads/profile-image/${currentUser.userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to upload image");
      }

      // Set the image URL (now in the data property)
      const imageUrl = result.data.profileImageUrl;
      setProfileImage(imageUrl);

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image");
      throw error;
    }
  };

  // Handle image upload completion
  const handleImageUploaded = (imageUrl) => {
    setProfileImage(imageUrl);
  };

  // Fetch profile data on component mount
  useEffect(() => {
    if (currentUser?.userId) {
      fetchProfileData();
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  return {
    isLoading,
    error,
    profileImage,
    existingProfile,
    initialFormData,
    handleSubmitProfile,
    handleImageUploaded,
    handleImageUpload,
    fetchProfileData,
  };
}
