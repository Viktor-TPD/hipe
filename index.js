import mongoose from "mongoose";
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import registerRoutes from "./routes/index.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://hipe-production.up.railway.app"
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const envUser = process.env.DB_USER;
const envPassword = process.env.DB_PASSWORD;
const envConnectionString = process.env.DB_CON;
const uri = `mongodb+srv://${envUser}:${envPassword}${envConnectionString}`;

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");

    // Register API routes
    registerRoutes(app);

    // Serve static files from the React app build directory
    app.use(express.static(path.join(__dirname, "../dist")));

    // For any request that doesn't match an API route, send the React app
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../dist/index.html"));
    });

    app.listen(port, () => {
      console.log(`✅ API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Promise Rejection:", error);
});
