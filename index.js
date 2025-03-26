import mongoose from "mongoose";
import "dotenv/config";
import express from "express";
import cors from "cors";
import User from "./models/User.js";
import TestDev from "./models/TestDev.js";
import StudentProfile from "./models/StudentProfile.js";
import CompanyProfile from "./models/CompanyProfile.js";
import Liked from "./models/Liked.js";
import {clerkClient} from "@clerk/express";

const app = express();
const port = 4000;

app.use(express.json()); // gör koden läsba ibackend
app.use(cors()); // hanterar corsproblem

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


app.post("/api/create-user", async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    const user = new User({
      email,
      password,
      userType,
    });
    
    await user.save();
    
    if (userType === 'student') {
      res.redirect(`/api/create-studentProfile?id=${user._id}`);
    } else {
      res.redirect(`/create-companyProfile?id=${user._id}`);
    }
    console.log("✅ User saved:", user);
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//behöver jag skapa en routing i frontend för att det ska funka?

//lägg in userId (även på company), hur göra junctionkopplingen, sessionvariabel? måste finnas bättre sätt

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
      date
    });
    
    await liked.save();
    console.log("✅ Liked saved:", liked);
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// app.get("/", async (req, res) => {
// const getUsers = await clerkClient.users.getUserList();

// const usersData = getUsers.data.map(user => ({
//   id: user.id,
//   userType: user.publicMetadata ? user.publicMetadata.userType : null
// }));

// res.json(usersData);

// })






//   const testDatabase = async () => {
  //     try {
    //       const user = new User({
      //         email: 'viktor3@example.com',
      //         password: 'hascsdhedpassword123',
      //         userType: 'student',
      //       });
      //       await user.save();
//       console.log('✅ User created:', user);

//       const studentProfile = new StudentProfile({
//         userId: user._id,
//         name: 'Julia Andersson',
//         courseId: 'WEB2024',
//         specialization: ['Frontend', 'UX Design'],
//         software: ['Figma', 'Adobe XD'],
//         stack: ['React', 'Node.js', 'MongoDB'],
//         languages: ['JavaScript', 'HTML', 'CSS'],
//         portfolio: 'https://juliaportfolio.example.com'
//       });
//       await studentProfile.save();
//       console.log('✅ Student profile created:', studentProfile);

//       const companyProfile = new CompanyProfile({
//         userId: user._id,
//         companyName: 'TechFöretag AB',
//         industry: 'IT och Mjukvaruutveckling',
//         description: 'Vi är ett växande techföretag som utvecklar innovativa lösningar inom webbutveckling.',
//         contactPerson: {
//           name: 'Erik Svensson',
//           email: 'erik@techforetag.se'
//         },
//         internshipDetails: 'Vi söker praktikanter inom webbutveckling som kan arbeta med våra frontend-team.'
//       });
//       await companyProfile.save();
//       console.log('✅ Company profile created:', companyProfile);

//       const liked = new Liked({
//         studentId: studentProfile._id,  // Använder StudentProfile ID
//         companyId: companyProfile._id,  // Använder CompanyProfile ID
//         isPoked: false,
//         date: new Date()
//       });
//       await liked.save();
//       console.log('✅ Liked connection created:', liked);

//     }catch (error) {
//         console.error('❌ Error inserting data:', error);
//     }
//   };

//  testDatabase();
