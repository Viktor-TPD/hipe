import express from "express";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import CompanyProfile from "../models/CompanyProfile.js";
import upload, { uploadToS3 } from "../s3UploadImage.js";

const router = express.Router();

// Image upload route
router.post(
  "/api/upload-profile-image/:userId",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload file to S3
      const profileImageUrl = await uploadToS3(req.file);

      // We keep track of the userId for reference
      const userId = req.params.userId;

      // Find the user to determine their type
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Looking for profile with userId:", userId);
      console.log("User type:", user.userType);

      // Return the image URL to the client
      res.status(200).json({
        message: "Profile image uploaded successfully",
        profileImageUrl,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res
        .status(500)
        .json({ message: "Failed to upload image", error: error.message });
    }
  }
);

export default router;
