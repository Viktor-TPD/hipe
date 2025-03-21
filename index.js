import mongoose from 'mongoose';
import "dotenv/config";
import express from "express";
import User from './models/User.js';
import StudentProfile from './models/StudentProfile.js';
import CompanyProfile from './models/CompanyProfile.js';
import Liked from './models/Liked.js';

const app = express();
const port = 4000;


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

  const testDatabase = async () => {
    try {
      const user = new User({
        email: 'viktor3@example.com',
        password: 'hascsdhedpassword123', 
        userType: 'student',
      });
      await user.save();
      console.log('✅ User created:', user);
    
      const studentProfile = new StudentProfile({
        userId: user._id,
        name: 'Julia Andersson',
        courseId: 'WEB2024',
        specialization: ['Frontend', 'UX Design'],
        software: ['Figma', 'Adobe XD'],
        stack: ['React', 'Node.js', 'MongoDB'],
        languages: ['JavaScript', 'HTML', 'CSS'],
        portfolio: 'https://juliaportfolio.example.com'
      });
      await studentProfile.save();
      console.log('✅ Student profile created:', studentProfile);

      const companyProfile = new CompanyProfile({
        userId: user._id,
        companyName: 'TechFöretag AB',
        industry: 'IT och Mjukvaruutveckling',
        description: 'Vi är ett växande techföretag som utvecklar innovativa lösningar inom webbutveckling.',
        contactPerson: {
          name: 'Erik Svensson',
          email: 'erik@techforetag.se'
        },
        internshipDetails: 'Vi söker praktikanter inom webbutveckling som kan arbeta med våra frontend-team.'
      });
      await companyProfile.save();
      console.log('✅ Company profile created:', companyProfile);

      const liked = new Liked({
        studentId: studentProfile._id,  // Använder StudentProfile ID
        companyId: companyProfile._id,  // Använder CompanyProfile ID
        isPoked: false,                 
        date: new Date()
      });
      await liked.save();
      console.log('✅ Liked connection created:', liked);
  
    }catch (error) {
        console.error('❌ Error inserting data:', error);
    }
  };
  

 testDatabase();