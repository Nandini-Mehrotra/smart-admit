import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

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

router.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profile = req.body;

    await user.save();

    res.json({
      message: "Profile saved",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        bookmarks: user.bookmarks,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Profile save failed" });
  }
});

router.put("/bookmark", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const college = req.body;

    const alreadyExists = user.bookmarks.some(
      (item) => item.name === college.name
    );

    if (!alreadyExists) {
      user.bookmarks.push(college);
    }

    await user.save();

    res.json({
      message: "Bookmark saved",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        bookmarks: user.bookmarks,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Bookmark save failed" });
  }
});

// --- BOOKMARK TOGGLE ROUTE ---
router.put("/bookmark", protect, async (req, res) => {
  try {
    const { college } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // SAFEGUARD: Ensure the bookmarks array exists before we check it
    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    // Now it's perfectly safe to check!
    const isBookmarked = user.bookmarks.some((b) => b.name === college.name);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((b) => b.name !== college.name);
    } else {
      user.bookmarks.push(college);
    }

    const updatedUser = await user.save();

    res.json({
      message: "Bookmarks updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: req.headers.authorization.split(" ")[1],
        profile: updatedUser.profile,
        extractedResume: updatedUser.extractedResume,
        savedResults: updatedUser.savedResults,
        bookmarks: updatedUser.bookmarks,
        lastAdjustments: updatedUser.lastAdjustments,
      },
    });
  } catch (error) {
    console.error("BOOKMARK UPDATE ERROR:", error);
    res.status(500).json({ message: "Bookmark update failed" });
  }
});

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
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error("🚨 SIGNUP CRASH:", error); // <-- Add this!
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
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