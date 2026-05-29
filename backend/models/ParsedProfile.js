const mongoose = require("mongoose");

const parsedProfileSchema = new mongoose.Schema(
  {
    originalFileName: {
      type: String,
      required: true,
    },

    rawText: {
      type: String,
      required: true,
    },

    extractedData: {
      coreStream: String,
      topSkills: [String],
      internships: Number,
      majorProjects: Number,
      competitiveProgrammingRating: String,
      summary: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParsedProfile", parsedProfileSchema);