import express from "express";
import Liked from "../models/Liked.js";
import StudentProfile from "../models/StudentProfile.js";
import CompanyProfile from "../models/CompanyProfile.js";

const router = express.Router();

// GET /api/v1/likes - Get all likes with optional filtering
router.get("/", async (req, res) => {
  try {
    const { studentId, companyId, isPoked } = req.query;
    let query = {};

    // Add filters if provided
    if (studentId) query.studentId = studentId;
    if (companyId) query.companyId = companyId;
    if (isPoked !== undefined) query.isPoked = isPoked === "true";

    // Find likes with the query
    const likes = await Liked.find(query)
      .populate("studentId", "name courseId")
      .populate("companyId", "companyName industry");

    res.status(200).json({
      success: true,
      data: likes,
      count: likes.length,
    });
  } catch (error) {
    console.error("❌ Error fetching likes:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// GET /api/v1/likes/:id - Get a specific like
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const like = await Liked.findById(id)
      .populate("studentId", "name courseId")
      .populate("companyId", "companyName industry");

    if (!like) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      });
    }

    res.status(200).json({
      success: true,
      data: like,
    });
  } catch (error) {
    console.error("❌ Error fetching like:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// POST /api/v1/likes - Create a new like
router.post("/", async (req, res) => {
  try {
    const { studentId, companyId, isPoked } = req.body;

    // Validate required fields
    if (!studentId || !companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: studentId and companyId are required",
      });
    }

    // Check if student profile exists
    const student = await StudentProfile.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Check if company profile exists
    const company = await CompanyProfile.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    // Check if like already exists
    const existingLike = await Liked.findOne({ studentId, companyId });
    if (existingLike) {
      return res.status(409).json({
        success: false,
        message: "Like already exists for this student and company",
      });
    }

    const liked = new Liked({
      studentId,
      companyId,
      isPoked: isPoked || false,
      date: new Date(),
    });

    await liked.save();
    console.log("✅ Like created:", liked);

    res.status(201).json({
      success: true,
      message: "Like created successfully",
      data: liked,
    });
  } catch (error) {
    console.error("❌ Error creating like:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// PUT /api/v1/likes/:id - Update a like (e.g., change isPoked status)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isPoked } = req.body;

    // Find the like
    const like = await Liked.findById(id);

    if (!like) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      });
    }

    // Update isPoked status
    if (isPoked !== undefined) {
      like.isPoked = isPoked;
    }

    // Save the updated like
    await like.save();
    console.log("✅ Like updated:", like);

    res.status(200).json({
      success: true,
      message: "Like updated successfully",
      data: like,
    });
  } catch (error) {
    console.error("❌ Error updating like:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// DELETE /api/v1/likes/:id - Delete a like
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Liked.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Like deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting like:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

export default router;
