import express from "express";
import StudentProfile from "../models/StudentProfile.js";

const router = express.Router();

router.post("/create-studentProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
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
      description,
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
      description,
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

    if (description !== undefined) existingProfile.description = description;

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

router.get("/student-profiles", async (req, res) => {
  try {
    const studentProfiles = await StudentProfile.find().populate(
      "userId",
      "email"
    );
    res.status(200).json(studentProfiles);
  } catch (error) {
    console.error("❌ Error fetching student profiles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/student-profiles/filter", async (req, res) => {
  try {
    const { courseId, specialization, software, languages, stack } = req.query;

    let query = {};

    if (courseId) query.courseId = courseId;

    if (specialization) {
      query.specialization = {
        $in: Array.isArray(specialization) ? specialization : [specialization],
      };
    }

    if (software) {
      query.software = { $in: Array.isArray(software) ? software : [software] };
    }

    if (languages) {
      query.languages = {
        $in: Array.isArray(languages) ? languages : [languages],
      };
    }

    if (stack) query.stack = stack;

    const studentProfiles = await StudentProfile.find(query).populate(
      "userId",
      "email"
    );
    res.status(200).json(studentProfiles);
  } catch (error) {
    console.error("❌ Error fetching filtered student profiles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
