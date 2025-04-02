import express from "express";
import Liked from "../models/Liked.js";

const router = express.Router();

router.post("/create-Liked", async (req, res) => {
  try {
    const { studentId, companyId, isPoked, date } = req.body;
    const liked = new Liked({
      studentId,
      companyId,
      isPoked,
      date,
    });

    await liked.save();
    console.log("✅ Liked saved:", liked);
    res.status(201).json(liked);
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
