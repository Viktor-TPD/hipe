import mongoose from "mongoose";
import "dotenv/config";
import express from "express";
import cors from "cors";
import registerRoutes from "./routes/index.js";

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

const envUser = process.env.DB_USER;
const envPassword = process.env.DB_PASSWORD;
const envConnectionString = process.env.DB_CON;
const uri = `mongodb+srv://${envUser}:${envPassword}${envConnectionString}`;

console.log(uri);

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");

    registerRoutes(app);

    app.listen(port, () => {
      console.log(`✅ Perspiration API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Promise Rejection:", error);
});
