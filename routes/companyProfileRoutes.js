import express from "express";
import CompanyProfile from "../models/CompanyProfile.js";

const router = express.Router();

// GET /api/v1/companies - Get all company profiles
router.get("/", async (req, res) => {
  try {
    const { industry } = req.query;
    const query = industry ? { industry } : {};

    const companyProfiles = await CompanyProfile.find(query).populate(
      "userId",
      "email"
    );

    res.status(200).json({
      success: true,
      data: companyProfiles,
      count: companyProfiles.length,
    });
  } catch (error) {
    console.error("❌ Error fetching company profiles:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// GET /api/v1/companies/:id - Get a specific company profile
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let companyProfile = await CompanyProfile.findById(id).populate(
      "userId",
      "email"
    );

    if (!companyProfile) {
      companyProfile = await CompanyProfile.findOne({ userId: id }).populate(
        "userId",
        "email"
      );
    }

    if (!companyProfile) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: companyProfile,
    });
  } catch (error) {
    console.error("❌ Error fetching company profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// POST /api/v1/companies - Create a new company profile
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      companyName,
      industry,
      description,
      website,
      contactPerson,
      internshipDetails,
      profileImageUrl,
    } = req.body;

    if (
      !userId ||
      !companyName ||
      !industry ||
      !contactPerson ||
      !contactPerson.name ||
      !contactPerson.email
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const existingProfile = await CompanyProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "A profile already exists for this user",
      });
    }

    const company = new CompanyProfile({
      userId,
      companyName,
      industry,
      description,
      website,
      contactPerson: {
        name: contactPerson.name,
        email: contactPerson.email,
      },
      internshipDetails,
      profileImageUrl: profileImageUrl || "",
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: "Company profile created successfully",
      data: company,
    });
  } catch (error) {
    console.error("❌ Error creating company profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// PUT /api/v1/companies/:id - Update a company profile
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      companyName,
      industry,
      description,
      website,
      contactPerson,
      internshipDetails,
      profileImageUrl,
    } = req.body;

    const existingProfile = await CompanyProfile.findOne({ userId: id });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    if (companyName) existingProfile.companyName = companyName;
    if (industry) existingProfile.industry = industry;
    if (description !== undefined) existingProfile.description = description;
    if (website !== undefined) existingProfile.website = website;

    if (contactPerson) {
      existingProfile.contactPerson = {
        name: contactPerson.name || existingProfile.contactPerson.name,
        email: contactPerson.email || existingProfile.contactPerson.email,
      };
    }

    if (internshipDetails !== undefined)
      existingProfile.internshipDetails = internshipDetails;
    if (profileImageUrl !== undefined)
      existingProfile.profileImageUrl = profileImageUrl;

    await existingProfile.save();

    res.status(200).json({
      success: true,
      message: "Profil uppdaterad!",
      data: existingProfile,
    });
  } catch (error) {
    console.error("❌ Error updating company profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// DELETE /api/v1/companies/:id - Delete a company profile
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await CompanyProfile.findOneAndDelete({ userId: id });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company profile deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting company profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.get("/company-profiles", async (req, res) => {
  try {
    const companyProfiles = await CompanyProfile.find().populate(
      "userId",
      "email"
    );
    res.status(200).json(companyProfiles);
  } catch (error) {
    console.error("❌ Error fetching company profiles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
