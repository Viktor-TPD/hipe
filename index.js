import mongoose from 'mongoose';
import "dotenv/config";
import express from "express";

const app = express();
const port = 3000;


const envUser = process.env.DB_USER;
const envPassword = process.env.DB_PASSWORD;
const envConnectionString = process.env.DB_CON;
const uri = `mongodb+srv://${envUser}:${envPassword}${envConnectionString}`;



mongoose.connect(uri).then(
    app.listen(port, () => {
      console.log(`Perspiration API running on port ${port}`);
    })
  );