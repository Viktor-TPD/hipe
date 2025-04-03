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

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

// Very first routes - health checks before any middleware
app.get("/test", (req, res) => {
  res.send("Test route works!");
});

app.get("/health", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/v1/health", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    message: "API is running",
  });
});

// Then configure middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow all origins for debugging
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Database status endpoint
app.get("/api/v1/db-status", (req, res) => {
  const readyState = mongoose.connection.readyState;
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
    99: "uninitialized",
  };

  res.status(200).json({
    mongoStatus: stateMap[readyState] || "unknown",
    readyState: readyState,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DB_USER_SET: !!process.env.DB_USER,
      DB_PASSWORD_SET: !!process.env.DB_PASSWORD,
      DB_CON_SET: !!process.env.DB_CON,
      PORT: process.env.PORT || 4000,
    },
  });
});

// Start the server before connecting to MongoDB
const server = app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

// MongoDB connection
const envUser = process.env.DB_USER;
const envPassword = process.env.DB_PASSWORD;
const envConnectionString = process.env.DB_CON;
const uri = `mongodb+srv://${envUser}:${envPassword}${envConnectionString}`;

console.log("⏳ Connecting to MongoDB...");

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");

    // Direct test route
    app.get("/api/v1/direct-test", (req, res) => {
      res.json({ message: "Direct test successful" });
    });

    // Register API routes
    registerRoutes(app);

    // After API routes, serve static files
    app.use(express.static(path.join(__dirname, "../dist")));

    // Last: catch-all route for the React app
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../dist/index.html"));
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);

    // Create a special route to indicate DB error
    app.get("/api/v1/*", (req, res) => {
      if (!req.path.includes("health") && !req.path.includes("db-status")) {
        res.status(503).json({
          error: "Database unavailable",
          message: "The API is currently unable to connect to the database.",
        });
      }
    });
  });

// Error handling
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Promise Rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  // For certain errors, we might want to keep the server running
  if (error.name === "MongoNetworkError") {
    console.error(
      "Database connection issue detected - keeping server running"
    );
  } else {
    console.error("Critical error detected - shutting down");
    server.close(() => {
      process.exit(1);
    });
  }
});
