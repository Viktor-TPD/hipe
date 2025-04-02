import express from "express";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import CompanyProfile from "../models/CompanyProfile.js";

const router = express.Router();

// GET /api/v1/users - Get all users
router.get("/", async (req, res) => {
  try {
    // Only return non-sensitive user data
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// GET /api/v1/users/:id - Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// GET /api/v1/users/:id/profile - Get user profile (student or company)
router.get("/:id/profile", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profileData = null;

    if (user.userType === "student") {
      profileData = await StudentProfile.findOne({ userId: id });
    } else if (user.userType === "company") {
      profileData = await CompanyProfile.findOne({ userId: id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        profile: profileData,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// PUT /api/v1/users/:id - Update user data (not password)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, userType } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update provided fields
    if (email) {
      // Check if email is already in use by another user
      const emailExists = await User.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
      user.email = email;
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// DELETE /api/v1/users/:id - Delete a user and their profile
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete associated profile based on user type
    if (user.userType === "student") {
      await StudentProfile.findOneAndDelete({ userId: id });
    } else if (user.userType === "company") {
      await CompanyProfile.findOneAndDelete({ userId: id });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User and associated profile deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

export default router;
