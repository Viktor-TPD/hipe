import express from "express";
import StudentProfile from "../models/StudentProfile.js";

const router = express.Router();

// GET /api/v1/students - Get all student profiles with optional filters
router.get("/", async (req, res) => {
  try {
    const { courseId, specialization, software, languages, stack } = req.query;
    let query = {};

    // Add filters if provided
    if (courseId) query.courseId = courseId;

    if (specialization) {
      query.specialization = {
        $in: Array.isArray(specialization) ? specialization : [specialization],
      };
    }

    if (software) {
      query.software = {
        $in: Array.isArray(software) ? software : [software],
      };
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

    res.status(200).json({
      success: true,
      data: studentProfiles,
      count: studentProfiles.length,
    });
  } catch (error) {
    console.error("❌ Error fetching student profiles:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// GET /api/v1/students/:id - Get a specific student profile
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // First try to find by MongoDB _id
    let studentProfile = await StudentProfile.findById(id).populate(
      "userId",
      "email"
    );

    // If not found, try finding by userId
    if (!studentProfile) {
      studentProfile = await StudentProfile.findOne({ userId: id }).populate(
        "userId",
        "email"
      );
    }

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: studentProfile,
    });
  } catch (error) {
    console.error("❌ Error fetching student profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// POST /api/v1/students - Create a new student profile
router.post("/", async (req, res) => {
  try {
    const {
      userId,
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

    // Validate required fields
    if (!userId || !name || !courseId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: userId, name, and courseId are required",
      });
    }

    // Check if profile already exists for this user
    const existingProfile = await StudentProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "A profile already exists for this user",
      });
    }

    const student = new StudentProfile({
      userId,
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
    console.log("✅ StudentProfile created:", student);

    res.status(201).json({
      success: true,
      message: "Student profile created successfully",
      data: student,
    });
  } catch (error) {
    console.error("❌ Error creating student profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// PUT /api/v1/students/:id - Update a student profile
router.put("/:id", async (req, res) => {
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

    // Find the profile by userId
    const existingProfile = await StudentProfile.findOne({ userId: id });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Update provided fields only
    if (name) existingProfile.name = name;
    if (courseId) existingProfile.courseId = courseId;
    if (description !== undefined) existingProfile.description = description;
    if (specialization) existingProfile.specialization = specialization;
    if (software) existingProfile.software = software;
    if (stack) existingProfile.stack = stack;
    if (languages) existingProfile.languages = languages;
    if (portfolio) existingProfile.portfolio = portfolio;
    if (linkedin) existingProfile.linkedin = linkedin;
    if (profileImageUrl !== undefined)
      existingProfile.profileImageUrl = profileImageUrl;

    // Save the updated profile
    await existingProfile.save();
    console.log("✅ StudentProfile updated:", existingProfile);

    res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      data: existingProfile,
    });
  } catch (error) {
    console.error("❌ Error updating student profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// DELETE /api/v1/students/:id - Delete a student profile
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete by userId
    const result = await StudentProfile.findOneAndDelete({ userId: id });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student profile deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting student profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

export default router;
