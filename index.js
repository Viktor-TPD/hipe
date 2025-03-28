import mongoose from "mongoose";
import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import TestDev from "./models/TestDev.js";
import StudentProfile from "./models/StudentProfile.js";
import CompanyProfile from "./models/CompanyProfile.js";
import Liked from "./models/Liked.js";
import { clerkClient } from "@clerk/express";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

const envUser = process.env.DB_USER;
const envPassword = process.env.DB_PASSWORD;
const envConnectionString = process.env.DB_CON;
const uri = `mongodb+srv://${envUser}:${envPassword}${envConnectionString}`;

console.log(uri);

mongoose.connect(uri).then(
  app.listen(port, () => {
    console.log(`Perspiration API running on port ${port}`);
  })
);

// User registration endpoint
app.post("/api/create-user", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email,
      password: hashedPassword,
      userType,
    });

    await user.save();

    const userJSON = {
      _id: user._id,
      email: user.email,
      userType: user.userType,
    };

    console.log("✅ User saved:", user);

    res.status(201).send(JSON.stringify(userJSON));
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userJSON = {
      _id: user._id,
      email: user.email,
      userType: user.userType,
    };

    res.status(200).json(userJSON);
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/create-studentProfile/:id", async (req, res) => {
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
    });

    await student.save();
    console.log("✅ StudentProfile saved:", student);
    res.status(201).json(student);
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/create-companyProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      companyName,
      industry,
      description,
      contactPerson: { name, email },
      internshipDetails,
    } = req.body;
    const company = new CompanyProfile({
      userId: id,
      companyName,
      industry,
      description,
      contactPerson: {
        name,
        email,
      },
      internshipDetails,
    });

    await company.save();
    console.log("✅ CompanyProfile saved:", company);
    res.status(201).json(company);
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/create-Liked", async (req, res) => {
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

app.post("/api/verify-session", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Session valid" });
  } catch (error) {
    console.error("❌ Error verifying session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Optional: Add a logout endpoint (server-side)
app.post("/api/logout", async (req, res) => {
  // In a real app, you might invalidate tokens or sessions here
  res.status(200).json({ message: "Logged out successfully" });
});

app.get("/api/user-profile/:userId", async (req, res) => {
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
