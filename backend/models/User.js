import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    profile: {
      college: { type: String, default: "" },
      year: { type: String, default: "" },
      gpa: { type: String, default: "" },

      targetCountries: {
        type: [String],
        default: [],
      },

      targetStates: {
        type: [String],
        default: [],
      },

      maxBudget: {
        type: Number,
        default: 0,
      },
    },

    extractedResume: {
      coreStream: {
        type: String,
        default: "",
      },

      topSkills: {
        type: [String],
        default: [],
      },

      internships: {
        type: Number,
        default: 0,
      },

      projects: {
        type: Number,
        default: 0,
      },

      cpRating: {
        type: String,
        default: "",
      },
    },

    savedResults: {
      safe: {
        type: [String],
        default: [],
      },

      target: {
        type: [String],
        default: [],
      },

      dream: {
        type: [String],
        default: [],
      },
    },

    bookmarks: { 
        type: Array, 
        default: [] 
      },

    lastAdjustments: {
      gpaBoost: {
        type: Number,
        default: 0,
      },

      internshipBoost: {
        type: Number,
        default: 0,
      },

      projectBoost: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

// Auto-hash the password right before saving to MongoDB
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper function to check passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);