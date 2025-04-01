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

      // Update the user's profile with the image URL
      const userId = req.params.userId;

      // Find the user first to determine their type
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Looking for profile with userId:", userId);
      console.log("User type:", user.userType);

      // Update the appropriate profile based on user type
      if (user.userType === "student") {
        // Try to find the student profile
        let studentProfile = await StudentProfile.findOne({ userId: userId });
        console.log("Found student profile:", studentProfile ? "Yes" : "No");

        if (!studentProfile) {
          //@todo Delete this logic later, keep the url string sent to the user object
          // If profile doesn't exist, create a new one
          studentProfile = new StudentProfile({
            userId: userId,
            name: user.email.split("@")[0], // Use part of email as fallback name
            courseId: "unknown", // Default values
            profileImageUrl: profileImageUrl,
          });

          // await studentProfile.save();
          console.log("did not create a new student profile with image");
        } else {
          // Update existing profile
          studentProfile.profileImageUrl = profileImageUrl;
          // await studentProfile.save();
          console.log("Updated existing student profile with image");
        }
      } else if (user.userType === "company") {
        // Try to find the company profile
        let companyProfile = await CompanyProfile.findOne({ userId: userId });
        console.log("Found company profile:", companyProfile ? "Yes" : "No");

        if (!companyProfile) {
          // @todo Delete this logic later, keep the url string sent to the user object
          // If profile doesn't exist, create a new one
          companyProfile = new CompanyProfile({
            userId: userId,
            companyName: user.email.split("@")[1] || "Company", // Domain as fallback name
            industry: "Not specified",
            contactPerson: {
              name: "Contact Person",
              email: user.email,
            },
            profileImageUrl: profileImageUrl,
          });

          // await companyProfile.save();
          console.log("did not create new company profile with image");
        } else {
          // Update existing profile
          companyProfile.profileImageUrl = profileImageUrl;
          // await companyProfile.save();
          console.log("Updated existing company profile with image");
        }
      }

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
