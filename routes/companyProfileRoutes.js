import express from "express";
import CompanyProfile from "../models/CompanyProfile.js";

const router = express.Router();

router.post("/create-companyProfile/:id", async (req, res) => {
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

    console.log("Creating company profile for user:", id);
    console.log("With profile image URL:", profileImageUrl);

    const company = new CompanyProfile({
      userId: id,
      companyName,
      industry,
      description,
      website,
      contactPerson: {
        name: contactPerson.name,
        email: contactPerson.email,
      },
      internshipDetails,
      profileImageUrl: profileImageUrl || "", // Ensure this field is included
    });

    await company.save();
    console.log("✅ CompanyProfile saved:", company);
    res.status(201).json(company);
  } catch (error) {
    console.error("❌ Error saving company data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-companyProfile/:id", async (req, res) => {
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

    console.log("Updating company profile for user:", id);
    console.log("Received profile image URL:", profileImageUrl);

    // Find the existing profile
    const existingProfile = await CompanyProfile.findOne({ userId: id });

    if (!existingProfile) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    // Update the profile with new data
    existingProfile.companyName = companyName;
    existingProfile.industry = industry;

    // Only update these fields if they are provided in the request
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

    // Always update profileImageUrl even if it's empty string, to allow removing images
    existingProfile.profileImageUrl = profileImageUrl;
    console.log("Setting profile image URL to:", profileImageUrl);

    // Save the updated profile
    await existingProfile.save();

    console.log("✅ CompanyProfile updated:", existingProfile);
    res.status(200).json(existingProfile);
  } catch (error) {
    console.error("❌ Error updating company profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
