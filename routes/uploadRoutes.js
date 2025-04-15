import express from "express";
import User from "../models/User.js";
import upload, { uploadToS3 } from "../s3UploadImage.js";

const router = express.Router();

// POST /api/v1/uploads/profile-image/:userId - Upload a profile image
router.post(
  "/profile-image/:userId",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const userId = req.params.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const profileImageUrl = await uploadToS3(req.file);

      res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        data: { profileImageUrl },
      });
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error: error.message,
      });
    }
  }
);

// DELETE /api/v1/uploads/profile-image/:userId - Remove a profile image
router.delete("/profile-image/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
    });
  } catch (error) {
    console.error("❌ Error removing profile image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove profile image",
      error: error.message,
    });
  }
});

export default router;
