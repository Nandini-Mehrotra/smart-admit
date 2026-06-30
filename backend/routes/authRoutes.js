import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Middleware to protect routes securely (Flexible Token Extraction)
function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Safely extract the token whether it includes "Bearer " or not
  const token = authHeader.includes(" ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// --- GET CURRENT USER ---
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching profile" });
  }
});

// --- UPDATE PROFILE (Forced Save) ---
router.put("/profile", protect, async (req, res) => {
  try {
    // Using $set forces Mongoose to detect and save the nested object
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: { profile: req.body } },
      { new: true } // Returns the updated document instead of the old one
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Safely extract token to send back to frontend
    const authHeader = req.headers.authorization;
    const token = authHeader.includes(" ") ? authHeader.split(" ")[1] : authHeader;

    res.json({
      message: "Profile saved",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile: updatedUser.profile,
        bookmarks: updatedUser.bookmarks,
        token: token, 
      },
    });
  } catch (error) {
    console.error("PROFILE SAVE ERROR:", error);
    res.status(500).json({ message: "Profile save failed" });
  }
});

// --- TOGGLE BOOKMARK ---
router.put("/bookmark", protect, async (req, res) => {
  try {
    // 1. Extract payload safely
    const college = req.body.college || req.body;

    // 2. HARD STOP: Block the request if the frontend sends null or empty data
    if (!college || typeof college !== 'object' || !college.name) {
      return res.status(400).json({ message: "Invalid or missing college data provided" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    // 3. THE VACCINE: Purge any 'null' or 'undefined' ghosts from the database
    user.bookmarks = user.bookmarks.filter((b) => b !== null && b !== undefined);

    // 4. Safely check if the college exists
    const isBookmarked = user.bookmarks.some((b) => b.name === college.name);

    if (isBookmarked) {
      // Remove it
      user.bookmarks = user.bookmarks.filter((b) => b.name !== college.name);
    } else {
      // Add it
      user.bookmarks.push(college);
    }

    // Save the newly cleaned array
    const updatedUser = await user.save();
    
    const authHeader = req.headers.authorization;
    const token = authHeader.includes(" ") ? authHeader.split(" ")[1] : authHeader;

    res.json({
      message: "Bookmarks updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile: updatedUser.profile,
        bookmarks: updatedUser.bookmarks,
        token: token, 
      },
    });
  } catch (error) {
    console.error("BOOKMARK UPDATE ERROR:", error);
    res.status(500).json({ message: "Bookmark update failed" });
  }
});

// --- SIGNUP ---
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        bookmarks: user.bookmarks,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error("🚨 SIGNUP CRASH:", error);
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        bookmarks: user.bookmarks, 
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;