import mongoose from 'mongoose';
import "dotenv/config";
import express from "express";
import User from './models/User.js';

const app = express();
const port = 2000;


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

//   mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => console.error('❌ Connection error:', err));

  const testDatabase = async () => {
    try {
      const user = new User({
        email: 'julia@example.com',
        password: 'hascsdhedpassword123', 
        userType: 'student',
      });
      await user.save();
      console.log('✅ User created:', user);
  
    }catch (error) {
        console.error('❌ Error inserting data:', error);
    }
  };
  

 testDatabase();