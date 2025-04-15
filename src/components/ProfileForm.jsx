import { useState } from "react";
import Form from "./Form";
import ProfileImageUpload from "./ProfilePictureUpload";

export default function ProfileForm({
  title,
  fields,
  onSubmit,
  initialValues = {},
  error,
  profileImage,
  onImageUploaded,
  isUpdateMode = false,
  isLoading = false,
}) {
  return (
    <div className="profile-form-container">
      <h2>{title}</h2>

      {error && <div className="error-message">{error}</div>}

      <ProfileImageUpload
        onImageUploaded={onImageUploaded}
        currentImage={profileImage}
      />

      {profileImage && (
        <div className="profile-preview">
          <h3>Profile Image</h3>
          <img
            src={profileImage}
            alt="Profile preview"
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
        onSubmit={onSubmit}
        submitLabel={isUpdateMode ? "Update Profile" : "Create Profile"}
        initialValues={initialValues}
        disabled={isLoading}
      />
    </div>
  );
}
