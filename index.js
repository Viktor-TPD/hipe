import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import "dotenv/config";
import registerRoutes from "./routes/index.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const port = process.env.PORT || 8080; // Default to 8080 for Railway

// Detailed startup logging
console.log(`
╔══════════════════════════════════════════════════╗
║             SERVER CONFIGURATION                 ║
╚══════════════════════════════════════════════════╝
Environment:      ${process.env.NODE_ENV || "Not set"}
Port:             ${port}
Current Directory: ${__dirname}
Dist Directory:   ${path.join(__dirname, "dist")}
`);

// Request logger middleware - log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins for debugging
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Basic middleware
app.use(express.json());

// Debug routes
app.get("/debug-test", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  res.send(
    JSON.stringify(
      {
        message: "Debug endpoint working!",
        timestamp: new Date().toISOString(),
        headers: req.headers,
        path: req.path,
      },
      null,
      2
    )
  );
});

// Test route with parameterized URL to bypass caching
app.get("/api-check/:random", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  res.send(
    JSON.stringify(
      {
        message: "API check successful",
        random: req.params.random,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );
});

// Check database connectivity
app.get("/db-check", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  const readyState = mongoose.connection.readyState;
  const statuses = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.send(
    JSON.stringify(
      {
        dbStatus: statuses[readyState] || "unknown",
        readyState: readyState,
        dbConfig: {
          userConfigured: !!process.env.DB_USER,
          passwordConfigured: !!process.env.DB_PASSWORD,
          connectionStringConfigured: !!process.env.DB_CON,
        },
      },
      null,
      2
    )
  );
});

// Start server immediately - don't wait for DB
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║             SERVER STARTED SUCCESSFULLY          ║
╚══════════════════════════════════════════════════╝
✅ Server running on port ${port}
`);
});

// Configure MongoDB connection
const envUser = process.env.DB_USER;
const envPassword = process.env.DB_PASSWORD;
const envConnectionString = process.env.DB_CON;
const uri = `mongodb+srv://${envUser}:${envPassword}${envConnectionString}`;

// Print a masked version of the connection string for debugging
console.log(
  `DB Connection String format: mongodb+srv://***:***${envConnectionString}`
);

// Connect to MongoDB
console.log("⏳ Connecting to MongoDB...");
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");

    // Register API routes after DB connection
    registerRoutes(app);
    console.log("✅ API routes registered");

    // Add API test endpoint
    app.get("/api/v1/test", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(
        JSON.stringify(
          {
            message: "API routes registered successfully",
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )
      );
    });

    console.log("⏳ Setting up static file serving...");

    // Serve static files AFTER registering API routes
    app.use(express.static(path.join(__dirname, "dist")));

    // Enhanced logging for static file serving
    console.log(
      `Static files will be served from: ${path.join(__dirname, "dist")}`
    );

    // Catch-all route for React app - MUST be last
    app.get("*", (req, res) => {
      console.log(`Serving React app for path: ${req.path}`);
      const indexPath = path.join(__dirname, "dist", "index.html");
      console.log(`Attempting to serve: ${indexPath}`);

      // Add comprehensive error handling
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error("Error serving index.html:", err);

          // Log additional diagnostic information
          const fileExists = require("fs").existsSync(indexPath);
          console.log(`Index file exists: ${fileExists}`);

          // More detailed error response
          res.status(500).send(`
            Error loading application. 
            Possible causes:
            - Build not completed
            - Incorrect dist directory
            - File permissions issue
          `);
        }
      });
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    // Note: Keep server running despite DB connection failure
  });

// Error handling
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Promise Rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

export default app;
