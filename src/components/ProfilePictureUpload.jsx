import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNotification } from "../NotificationContext";
import { API_BASE_URL } from "./../config";

function ProfileImageUpload({ onImageUploaded, currentImage }) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();

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
        "Vänligen välj en av följande filtyper: JPEG, PNG, or GIF",
        "error"
      );
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showNotification("Bilder måste vara under 5MB", "error");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    uploadFile(selectedFile);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/uploads/profile-image/${currentUser.userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Bilduppladdning misslyckades");
      }

      if (onImageUploaded) {
        onImageUploaded(data.data.profileImageUrl);
      }

      showNotification("Bild uppladdad!", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showNotification(error.message || "Failed to upload image", "error");

      if (currentImage) {
        setPreview(currentImage);
      } else {
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

        <button className="upload-actions">
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            disabled={isUploading}
          />
          <label htmlFor="profileImage" className="button-select">
            {isUploading ? "Laddar upp..." : "Ladda upp bild"}
            <img src="/assets/images/upload.svg" alt="" />
          </label>
        </button>
      </div>
    </div>
  );
}

export default ProfileImageUpload;
