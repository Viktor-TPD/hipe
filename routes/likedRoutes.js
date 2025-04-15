import express from "express";
import Liked from "../models/Liked.js";
import StudentProfile from "../models/StudentProfile.js";
import CompanyProfile from "../models/CompanyProfile.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/v1/likes - Get likes with optional filtering
router.get("/", async (req, res) => {
  try {
    const { studentId, companyId } = req.query;

    // Allow more flexible querying - either one or both parameters can be provided
    const query = {};
    if (studentId) query.studentId = studentId;
    if (companyId) query.companyId = companyId;

    // If no query parameters are provided, return an error
    if (Object.keys(query).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one of studentId or companyId is required",
      });
    }

    const likes = await Liked.find(query);

    console.log("Likes Found:", {
      query,
      count: likes.length,
    });

    return res.status(200).json({
      success: true,
      data: likes,
      count: likes.length,
    });
  } catch (error) {
    console.error("❌ Error fetching likes:", error);
    return res.status(500).json({
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

    // Validate required fields
    if (!studentId || !companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: studentId and companyId are required",
      });
    }

    // Validate ObjectIDs to prevent server errors
    try {
      new mongoose.Types.ObjectId(studentId);
      new mongoose.Types.ObjectId(companyId);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
        error: error.message,
      });
    } // Verify that studentId refers to a valid StudentProfile

    const student = await StudentProfile.findById(studentId);
    if (!student) {
      console.error(`Student profile not found for ID: ${studentId}`);
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Verify that companyId refers to a valid CompanyProfile
    const company = await CompanyProfile.findById(companyId);
    if (!company) {
      console.error(`Company profile not found for ID: ${companyId}`);
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    // Check if the like already exists
    const existingLike = await Liked.findOne({ studentId, companyId });

    if (existingLike) {
      // Like exists, so delete it
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
      // Like doesn't exist, so create it
      const infoString = `${company.companyName} liked ${student.name}`;

      const liked = new Liked({
        studentId,
        companyId,
        info: infoString,
      });

      await liked.save();

      let isFirstLike = false;

      if (!company.hasLikedOnce) {
        company.hasLikedOnce = true;
        await company.save();
        isFirstLike = true;
      }

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
        firstLike: isFirstLike, 
      });
    }
  } catch (error) {
    console.error("❌ Error handling like:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// GET /api/v1/likes/student/:studentId - Get all companies that liked a student
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate StudentProfile exists
    const student = await StudentProfile.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Find all likes for this student and populate company details
    const likes = await Liked.find({ studentId }).populate({
      path: "companyId",
      select:
        "companyName industry description website contactPerson profileImageUrl",
    });

    return res.status(200).json({
      success: true,
      data: likes,
      count: likes.length,
    });
  } catch (error) {
    console.error("❌ Error fetching student likes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// GET /api/v1/likes/company/:companyId - Get all students liked by a company
router.get("/company/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;

    // Validate CompanyProfile exists
    const company = await CompanyProfile.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    // Find all likes by this company and populate student details
    const likes = await Liked.find({ companyId }).populate({
      path: "studentId",
      select:
        "name courseId specialization software stack languages portfolio linkedin profileImageUrl",
    });

    return res.status(200).json({
      success: true,
      data: likes,
      count: likes.length,
    });
  } catch (error) {
    console.error("❌ Error fetching company likes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

export default router;
