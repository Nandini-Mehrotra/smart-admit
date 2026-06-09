import mongoose from "mongoose";
import dotenv from "dotenv";
import College from "./models/College.js"; // Make sure this path points to your model

dotenv.config();

const collegeData = [
  // India
  { name: "IIIT Hyderabad", country: "India", state: "Telangana", tuition: 450000, requiredFitScore: 85 },
  { name: "BITS Pilani", country: "India", state: "Rajasthan", tuition: 600000, requiredFitScore: 82 },
  { name: "IIT Bombay", country: "India", state: "Maharashtra", tuition: 250000, requiredFitScore: 95 },
  { name: "NIT Trichy", country: "India", state: "Tamil Nadu", tuition: 150000, requiredFitScore: 88 },
  { name: "RV College of Engineering", country: "India", state: "Karnataka", tuition: 300000, requiredFitScore: 75 },
  
  // USA
  { name: "MIT", country: "USA", state: "Massachusetts", tuition: 60000, requiredFitScore: 98 },
  { name: "Stanford University", country: "USA", state: "California", tuition: 58000, requiredFitScore: 97 },
  { name: "Georgia Tech", country: "USA", state: "Georgia", tuition: 33000, requiredFitScore: 89 },
  { name: "University of Texas at Austin", country: "USA", state: "Texas", tuition: 40000, requiredFitScore: 84 },
  { name: "Purdue University", country: "USA", state: "Indiana", tuition: 31000, requiredFitScore: 80 },
  
  // UK
  { name: "University of Oxford", country: "UK", state: "Oxfordshire", tuition: 45000, requiredFitScore: 96 },
  { name: "Imperial College London", country: "UK", state: "London", tuition: 50000, requiredFitScore: 92 },
  { name: "University of Edinburgh", country: "UK", state: "Scotland", tuition: 35000, requiredFitScore: 85 },
  
  // Canada & Australia
  { name: "University of Toronto", country: "Canada", state: "Ontario", tuition: 45000, requiredFitScore: 88 },
  { name: "University of Waterloo", country: "Canada", state: "Ontario", tuition: 48000, requiredFitScore: 87 },
  { name: "University of Melbourne", country: "Australia", state: "Victoria", tuition: 42000, requiredFitScore: 85 }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB.");

    // Clear existing data so we don't get duplicates
    await College.deleteMany({});
    console.log("🧹 Cleared old college data.");

    // Insert the new array
    await College.insertMany(collegeData);
    console.log("✅ Successfully seeded database with", collegeData.length, "colleges!");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();