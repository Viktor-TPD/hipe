import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

function ProfileImageUpload({ onImageUploaded, currentImage }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Initialize preview with currentImage if available
  useEffect(() => {
    if (currentImage) {
      console.log("ProfileImageUpload received currentImage:", currentImage);
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);

    if (!selectedFile) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please select an image file (JPEG, PNG, or GIF)");
      return;
    }

    // Check file size (max 2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      console.log("Uploading image for user:", currentUser.userId);

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

      console.log("Profile image upload successful:", data.profileImageUrl);

      // Set the preview with the new image URL
      setPreview(data.profileImageUrl);

      // Call the callback with the image URL
      if (onImageUploaded) {
        onImageUploaded(data.profileImageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="profile-image-upload">
      <div className="upload-container">
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        ) : (
          <div className="upload-placeholder">
            <p>Select an image</p>
          </div>
        )}

        <input
          type="file"
          id="profileImage"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />

        <div className="upload-actions">
          <label htmlFor="profileImage" className="select-button">
            {currentImage ? "Change Image" : "Select Image"}
          </label>

          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="upload-button"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ProfileImageUpload;
