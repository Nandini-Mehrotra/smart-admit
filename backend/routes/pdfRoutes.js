const express = require("express");
const multer = require("multer");
const { parseResumePdf } = require("../controllers/pdfController");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/parse-resume", upload.single("resume"), parseResumePdf);

module.exports = router;