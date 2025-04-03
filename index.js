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

// Configure middleware
app.use(express.json());

// Configure CORS middleware
app.use(
  cors({
    origin: "*", // Allow all origins temporarily for debugging
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check endpoints that don't depend on database connectivity
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
    path: req.path,
    headers: req.headers,
  });
});

// Diagnostic endpoint for MongoDB connection status
app.get("/api/v1/db-status", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
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

// Database connection
const envUser = process.env.DB_USER;
const envPassword = process.env.DB_PASSWORD;
const envConnectionString = process.env.DB_CON;
const uri = `mongodb+srv://${envUser}:${envPassword}${envConnectionString}`;

console.log("⏳ Connecting to MongoDB...");

// Start server first, then connect to database
const server = app.listen(port, () => {
  console.log(`✅ API server running on port ${port}`);
});

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");

    // Register API routes
    registerRoutes(app);

    // Direct test route after route registration
    app.get("/api/v1/direct-test", (req, res) => {
      res.json({ message: "Direct test successful" });
    });

    // Serve static files from the React app build directory
    app.use(express.static(path.join(__dirname, "../dist")));

    // For any request that doesn't match an API route, send the React app
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../dist/index.html"));
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    console.error(
      "Connection URI format (without credentials):",
      uri.replace(envUser, "***").replace(envPassword, "***")
    );

    // Add a route to notify about the database being unavailable
    app.get("/api/v1/*", (req, res) => {
      res.status(503).json({
        error: "Database unavailable",
        message: "The API is currently unable to connect to the database.",
      });
    });
  });

// Error handling
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Promise Rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  // Avoid abrupt shutdown for non-critical errors
  if (error.code === "ECONNREFUSED" || error.name === "MongoNetworkError") {
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
