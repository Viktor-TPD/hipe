import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// User registration endpoint
router.post("/create-user", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

router.post("/verify-session", async (req, res) => {
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

router.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
