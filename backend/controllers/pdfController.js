const fs = require("fs");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const ParsedProfile = require("../models/ParsedProfile");

const parseResumePdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded",
      });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const rawText = pdfData.text;

    const prompt = `
You are an admissions profile parser.

Extract this resume text into STRICT JSON only.
Do not include markdown.
Do not include explanation.

Return this exact structure:
{
  "coreStream": "string",
  "topSkills": ["skill1", "skill2"],
  "internships": 0,
  "majorProjects": 0,
  "competitiveProgrammingRating": "string or Not available",
  "summary": "short summary"
}

Resume text:
${rawText}
`;

    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const aiText =
      geminiResponse.data.candidates[0].content.parts[0].text;

    const cleanedText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const extractedData = JSON.parse(cleanedText);

    const savedProfile = await ParsedProfile.create({
      originalFileName: req.file.originalname,
      rawText,
      extractedData,
    });

    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      message: "Resume parsed and saved successfully",
      data: savedProfile,
    });
  } catch (error) {
    console.error("PDF parsing error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to parse resume",
      error: error.message,
    });
  }
};

module.exports = { parseResumePdf };