import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import mongoose from "mongoose";
import { createRequire } from "module";
import { GoogleGenerativeAI } from "@google/generative-ai";
import College from './models/College.js';
import authRoutes from './routes/authRoutes.js';

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
dotenv.config();

const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://smart-admit-eta.vercel.app" 
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use('/api/auth', authRoutes);

const upload = multer({ storage: multer.memoryStorage() });

const resumeSchema = new mongoose.Schema(
  {
    fileName: String,
    rawText: String,
    extractedData: Object,
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

// Health route
app.get("/api/health", (req, res) => {
  res.json({ status: "success", message: "Smart Admit API is running!🚀"});
});

// Upload + parse PDF + call Gemini + save to MongoDB
app.post("/api/pdf/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1. Catch live filters from the React sidebar
    const { targetCountry, targetState, maxBudget_USD } = req.body;

    // Convert PDF buffer into readable text
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    // 2. THE OMNI-STREAM ADMISSIONS PROMPT
    const prompt = `
    You are an expert University Admissions Reviewer evaluating applicants across all academic fields. 
    Read the provided resume text and extract the data into a precise JSON object. 
    Return ONLY valid JSON. Do not use markdown formatting (no \`\`\`json blocks). Do not include any explanations.

    CRITICAL INSTRUCTIONS FOR 'stream' & 'skills':
    - Categorize the applicant into exactly one of these streams: "Engineering", "Business", "Arts", "Science", or "Design".
    - Extract their current skills and combine them into a single string separated by hyphens (e.g., "Python-React-AutoCAD").

    CRITICAL INSTRUCTIONS FOR 'skillGap':
    - Analyze the applicant's current skills and their stream.
    - Identify 3 to 4 highly demanded, industry-standard skills they are MISSING that would elevate their profile to a top-tier university.
    - Return these missing skills as an array of strings.

    Rules:
    - Count internships and major projects from the text.
    - If missing, use the default values shown below.

    Use EXACTLY these keys:
    {
      "stream": "Engineering",
      "skills": "C++-Python-React",
      "skillGap": ["Cloud Computing", "System Design", "Docker"],
      "internships": 0,
      "majorProjects": 0
    }

    Resume text:
    ${rawText}
    `;

    // Initialize official Google SDK using the live 2.5-flash engine
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    let aiText = "{}";
    try {
      const result = await model.generateContent(prompt);
      aiText = result.response.text();
      console.log("🤖 GEMINI RAW RESPONSE:", aiText);
    } catch (apiError) {
      console.error("🚨 Gemini API Network Error:", apiError.message);
    }

    const cleanedText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let extractedData = {};
    try {
      extractedData = JSON.parse(cleanedText);
    } catch (e) {
      console.log("JSON Parse Error. Fallback to empty object.");
    }

    // Failsafe execution if API drops
    if (!extractedData.skills || Object.keys(extractedData).length === 0) {
      console.log("⚠️ Gemini failed to extract. Applying Failsafe data.");
      extractedData = {
        stream: "Engineering",
        skills: "C++-Python-JavaScript-React.js-Node.js-MongoDB",
        skillGap: ["Docker", "AWS", "System Design"], // <--- Add this!
        internships: 0,
        majorProjects: 2
      };
    }

    // 4. THE GOLDEN MERGE: Forward formatted payload to Python ML
    const mlPayload = {
      stream: extractedData.stream || "Engineering",
      skills: extractedData.skills || "React-Node",
      internships: Number(extractedData.internships) || 0,
      majorProjects: Number(extractedData.majorProjects) || 0,
      targetCountry: targetCountry,          
      targetState: targetState,              
      maxBudget_USD: Number(maxBudget_USD)   
    };

    const pythonBaseUrl = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";
    const pythonResponse = await fetch(`${pythonBaseUrl}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mlPayload)
    });

    const responseText = await pythonResponse.text();
    console.log("Flask raw response snippet:", responseText.substring(0, 100));

    let mlPrediction;
    
    // THE GRACEFUL CATCH
    try {
      // We try to parse the JSON. 
      mlPrediction = JSON.parse(responseText);
    } catch (parseError) {
      // If it crashes here, it means Render sent an HTML "waking up" page instead of JSON data!
      console.log("⚠️ Python AI engine is currently asleep and warming up.");
      
      return res.status(503).json({
        status: "warming_up",
        message: "Our AI Prediction Engine is currently waking up from sleep mode. Please wait about 30-50 seconds and try uploading your resume again!"
      });
    }

// 5. DATABASE MATCHING ROUTINE
    // Query your MongoDB matching the user's location filters and budget limits
    let collegeQuery = {};
    if (targetCountry && targetCountry !== "Any") collegeQuery.country = targetCountry;
    if (targetState && targetState !== "Any") collegeQuery.state = targetState;
    if (maxBudget_USD) collegeQuery.tuition = { $lte: Number(maxBudget_USD) };

    const rawColleges = await College.find(collegeQuery);
    
    // Grab the user's specific probability score
    const userScore = mlPrediction?.prediction?.admissionProbability || 80;

    // Loop through colleges and calculate individual tiers
    const recommendedColleges = rawColleges.map(college => {
      const colObj = college.toObject(); // Convert from Mongoose to standard JS object
      const fitScore = colObj.requiredFitScore || 85; 

      // The Tier Logic
      if (userScore >= fitScore + 5) {
        colObj.calculatedTier = "Safe";
      } else if (userScore <= fitScore - 5) {
        colObj.calculatedTier = "Dream";
      } else {
        colObj.calculatedTier = "Target"; // Within a 5-point realistic range
      }
      
      return colObj;
    });

    console.log(`Matched ${recommendedColleges.length} colleges from the database.`);

    // Save history to MongoDB
    const savedResume = await Resume.create({
      fileName: req.file.originalname,
      rawText,
      extractedData,
    });

    // Send unified payload back to the UI
    res.json({
      status: "success",
      message: "PDF processed and combined with database matching",
      data: savedResume,
      extractedData: extractedData, 
      mlResult: mlPrediction,
      colleges: recommendedColleges // <--- Frontend cards now have their source array!
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while processing the PDF",
      error: error.message,
    });
  }
});

// Filter Colleges Route
app.get('/api/colleges/filter', async (req, res) => {
  try {
    const { country, state, maxBudget } = req.query;
    let query = {};
    
    if (country) query.country = { $in: country.split(',') };
    if (state) query.state = { $in: state.split(',') };
    if (maxBudget) query.tuition = { $lte: Number(maxBudget) };

    const colleges = await College.find(query);
    res.json({
      status: 'success',
      results: colleges.length,
      data: colleges
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });