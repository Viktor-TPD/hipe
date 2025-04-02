import express from "express";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import CompanyProfile from "../models/CompanyProfile.js";

const router = express.Router();

router.get("/user-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profileData = null;

    if (user.userType === "student") {
      profileData = await StudentProfile.findOne({ userId });
    } else if (user.userType === "company") {
      profileData = await CompanyProfile.findOne({ userId });
    }

    res.status(200).json({
      user,
      profile: profileData,
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
