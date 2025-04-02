import express from "express";
import StudentProfile from "../models/StudentProfile.js";

const router = express.Router();

router.post("/create-studentProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      courseId,
      specialization,
      software,
      stack,
      languages,
      portfolio,
      linkedin,
      profileImageUrl,
    } = req.body;
    const student = new StudentProfile({
      userId: id,
      name,
      courseId,
      specialization,
      software,
      stack,
      languages,
      portfolio,
      linkedin,
      profileImageUrl,
    });

    await student.save();
    console.log("✅ StudentProfile saved:", student);
    res.status(201).json(student);
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-studentProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      courseId,
      specialization,
      software,
      stack,
      languages,
      portfolio,
      linkedin,
      profileImageUrl,
    } = req.body;

    // Find the existing profile
    const existingProfile = await StudentProfile.findOne({ userId: id });

    if (!existingProfile) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    // Update the profile with new data
    existingProfile.name = name;
    existingProfile.courseId = courseId;

    // Only update these fields if they are provided in the request
    if (specialization) existingProfile.specialization = specialization;
    if (software) existingProfile.software = software;
    if (stack) existingProfile.stack = stack;
    if (languages) existingProfile.languages = languages;
    if (portfolio) existingProfile.portfolio = portfolio;
    if (linkedin) existingProfile.linkedin = linkedin;
    if (profileImageUrl) existingProfile.profileImageUrl = profileImageUrl;

    // Save the updated profile
    await existingProfile.save();

    console.log("✅ StudentProfile updated:", existingProfile);
    res.status(200).json(existingProfile);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
