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

    //Convert PDF buffer into readable text
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    //Ask Gemini to convert resume text into JSON
    const prompt = `
Extract the following resume into valid JSON only.

Return this structure:
{
  "coreStream": "",
  "topSkills": [],
  "internships": 0,
  "majorProjects": 0,
  "competitiveProgrammingRating": "",
  "summary": ""
}

Resume text:
${rawText}
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const geminiData = await geminiResponse.json();

    const aiText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    //Clean Gemini output in case it returns ```json blocks
    const cleanedText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const extractedData = JSON.parse(cleanedText);

    //Save parsed result to MongoDB
    const savedResume = await Resume.create({
      fileName: req.file.originalname,
      rawText,
      extractedData,
    });

    // Forward the extracted JSON to the Python Flask server for ML Prediction
    const pythonResponse = await fetch("http://127.0.0.1:8000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(extractedData)
    });

    const mlPrediction = await pythonResponse.json();

    //finally send everything back to the frontend in one go
    res.json({
      status: "success",
      message: "PDF parsed, saved to MongoDB, and scored by Python ML",
      data: savedResume,
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

//Filter Colleges Route
app.get('/api/colleges/filter', async (req, res) => {
  try {
    //Grab the search parameters from the URL 
    const { state, maxBudget } = req.query;

    //Build the database query dynamically
    let query = {};
    
    if (state) {
      query.state = state;
    }
    
    if (maxBudget) {
      // $lte is MongoDB syntax for "Less Than or Equal to"
      query.tuition = { $lte: Number(maxBudget) };
    }

    //Execute the search using our Compound Index
    const colleges = await College.find(query);
    
    //Send the matching colleges back to the frontend
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