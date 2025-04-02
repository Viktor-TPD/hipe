import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNotification } from "../NotificationContext";

function ProfileImageUpload({ onImageUploaded, currentImage }) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();

  // Initialize preview with currentImage if available
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!allowedTypes.includes(selectedFile.type)) {
      showNotification(
        "Please select an image file (JPEG, PNG, or GIF)",
        "error"
      );
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      showNotification("Image size should be less than 5MB", "error");
      return;
    }

    // Create local preview immediately
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Start upload process
    uploadFile(selectedFile);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch(
        `http://localhost:4000/api/upload-profile-image/${currentUser.userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      // Call the callback with the image URL
      if (onImageUploaded) {
        onImageUploaded(data.profileImageUrl);
      }

      showNotification("Image uploaded successfully", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showNotification(error.message || "Failed to upload image", "error");

      // If upload failed but we were updating an existing image, keep the old one
      if (currentImage) {
        setPreview(currentImage);
      } else {
        // If this was a new upload that failed, clear the preview
        setPreview(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="profile-image-upload">
      <div className="upload-container">
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Profile preview" />
          </div>
        ) : (
          <div className="upload-placeholder">
            {isUploading ? <p>Uploading...</p> : <p>Select an image</p>}
          </div>
        )}

        <div className="upload-actions">
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            disabled={isUploading}
          />
          <label htmlFor="profileImage" className="select-button">
            {isUploading
              ? "Uploading..."
              : currentImage
              ? "Change Image"
              : "Select Image"}
          </label>
        </div>
      </div>
    </div>
  );
}

export default ProfileImageUpload;
