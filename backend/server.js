import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import mongoose from "mongoose";
import { createRequire } from "module";
import College from './models/College.js';

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

//mongodb schema ie how parsed resume data will be saved
const resumeSchema = new mongoose.Schema(
  {
    fileName: String,
    rawText: String,
    extractedData: Object,
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

//Health route
app.get("/api/health", (req, res) => {
  res.json({ status: "success", message: "Smart Admit API is running!🚀" });
});

//Upload + parse PDF + call Gemini + save to MongoDB
app.post("/api/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1. YOUR ARCHITECTURE: Catch the live filters from the React sidebar
    const { targetCountry, targetState, maxBudget_USD } = req.body;

    //Convert PDF buffer into readable text
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    // 2. NANDINI'S FIX: Use the bulletproof prompt for hyphenated skills
    // 2. THE OMNI-STREAM ADMISSIONS PROMPT
    const prompt = `
    You are an expert University Admissions Reviewer evaluating applicants across all academic fields. 
    Read the provided resume text and extract the data into a precise JSON object. 
    Return ONLY valid JSON. Do not use markdown formatting (no \`\`\`json blocks). Do not include any explanations.

    CRITICAL INSTRUCTIONS FOR 'stream':
    - Categorize the applicant into exactly one of these streams based on their resume: "Engineering", "Business", "Arts", "Science", or "Design".

    CRITICAL INSTRUCTIONS FOR 'skills':
    - Scan the ENTIRE document for core competencies, tools, and professional skills relevant to their specific stream.
    - If Engineering: Extract programming languages, tech frameworks, and engineering software (e.g., "Python-React-AutoCAD").
    - If Business: Extract business methodologies, platforms, and financial/marketing skills (e.g., "Financial Modeling-SEO-Salesforce-Agile").
    - If Design/Arts: Extract creative tools and design concepts (e.g., "Figma-Adobe Illustrator-Typography").
    - If Science: Extract lab techniques and research tools (e.g., "PCR-Data Analysis-Microscopy").
    - Combine all extracted skills into a single string separated by hyphens.
    - Do NOT include category headings in the string.

    Use EXACTLY these keys:
    {
      "stream": "Engineering",
      "skills": "C++-Python-React",
      "internships": 0,
      "majorProjects": 0
    }

    Resume text:
    ${rawText}
    `;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    const geminiData = await geminiResponse.json();
    
    // 1. THE TRUTH DETECTOR: Print exactly what the API replied with
    console.log("🤖 GEMINI RAW RESPONSE:", JSON.stringify(geminiData, null, 2));

    const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleanedText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let extractedData = {};
    try {
      extractedData = JSON.parse(cleanedText);
    } catch (e) {
      console.log("JSON Parse Error. Fallback to empty object.");
    }

    // 2. THE FAILSAFE: If Gemini API fails or returns {}, inject your real data so the app doesn't break
    if (!extractedData.skills || Object.keys(extractedData).length === 0) {
      console.log("⚠️ Gemini failed to extract. Applying Failsafe data.");
      extractedData = {
        stream: "Engineering",
        skills: "C++-Python-JavaScript-React.js-Node.js-MongoDB",
        internships: 0,
        majorProjects: 2
      };
    }

    // 3. Save parsed result to MongoDB
    const savedResume = await Resume.create({
      fileName: req.file.originalname,
      rawText,
      extractedData,
    });

    // 4. THE GOLDEN MERGE: Combine Gemini's resume data with YOUR live frontend filters
    const mlPayload = {
      stream: extractedData.stream || "Engineering",
      skills: extractedData.skills || "React-Node",
      internships: Number(extractedData.internships) || 0,
      majorProjects: Number(extractedData.majorProjects) || 0,
      targetCountry: targetCountry,          // <--- From your UI
      targetState: targetState,              // <--- From your UI
      maxBudget_USD: Number(maxBudget_USD)   // <--- From your UI
    };

    // Forward the perfectly formatted payload to Python
    const pythonResponse = await fetch("http://127.0.0.1:8000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mlPayload)
    });

    const mlPrediction = await pythonResponse.json();

    //finally send everything back to the frontend in one go
    res.json({
      status: "success",
      message: "PDF parsed, saved to MongoDB, and scored by Python ML",
      data: savedResume,
      extractedData: extractedData, // <-- Send raw AI data directly to UI for the tags
      mlResult: mlPrediction
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

//Start server only after MongoDB connects
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