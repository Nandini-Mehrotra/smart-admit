import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer'; //used for translation of pdf files which are sent in json format into understandable form for backend

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors()); 
app.use(express.json()); 

//tell multer to keep the file in RAM(memory) instead of saving it to computer's hard drive.
const upload = multer({ storage: multer.memoryStorage() });

//mic check
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Smart Admit API is running!🚀' });
});

//"upload.single('resume')" as a middleware. It catches the incoming file labeled 'resume'.
app.post('/api/upload', upload.single('resume'), (req, res) => {
  
  //if no file arrived, send an error back to the frontend
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  //inform to backend
  console.log("File received:", req.file.originalname);
  console.log("File size:", req.file.size, "bytes");

  //inform frontend 
  res.json({ 
    message: "File successfully caught by the backend!",
    fileName: req.file.originalname 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
