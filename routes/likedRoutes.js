import express from "express";
import Liked from "../models/Liked.js";
import StudentProfile from "../models/StudentProfile.js";
import CompanyProfile from "../models/CompanyProfile.js";

const router = express.Router();

// GET /api/v1/likes - Get likes with optional filtering
router.get("/", async (req, res) => {
  try {
    const { studentId, companyId } = req.query;

    console.log("Likes Query Params:", { studentId, companyId });

    if (!studentId || !companyId) {
      return res.status(400).json({
        success: false,
        message: "Both studentId and companyId are required",
      });
    }

    const likes = await Liked.find({
      studentId,
      companyId,
    });

    console.log("Likes Found:", {
      count: likes.length,
      likes,
    });

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

// POST /api/v1/likes - Create or delete a like
router.post("/", async (req, res) => {
  try {
    const { studentId, companyId } = req.body;

    console.log("Received Like Request:", { studentId, companyId });

    if (!studentId || !companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: studentId and companyId are required",
      });
    }

    const student = await StudentProfile.findById(studentId);
    if (!student) {
      console.error(`Student profile not found for ID: ${studentId}`);
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const company = await CompanyProfile.findById(companyId);
    if (!company) {
      console.error(`Company profile not found for ID: ${companyId}`);
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const existingLike = await Liked.findOne({ studentId, companyId });

    if (existingLike) {
      await Liked.deleteOne({ studentId, companyId });

      console.log("✅ Like deleted:", {
        studentId,
        companyId,
      });

      return res.status(200).json({
        success: true,
        message: "Like removed successfully",
        action: "deleted",
      });
    } else {
      const infoString = `${company.companyName} liked ${student.name}`;

      const liked = new Liked({
        studentId,
        companyId,
        info: infoString,
      });

      await liked.save();

      console.log("✅ Like created:", {
        studentId,
        companyId,
        info: infoString,
      });

      return res.status(201).json({
        success: true,
        message: "Like created successfully",
        data: liked,
        action: "created",
      });
    }
  } catch (error) {
    console.error("❌ Error handling like:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

export default router;
