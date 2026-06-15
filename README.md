# Smart Admit

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_2.5-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

## Overview

Smart Admit is a full-stack, multi-service application designed to demystify the college admissions process. By leveraging large language models (LLMs) and machine learning, it analyzes a student's unstructured resume, calculates real-time admission probabilities, and generates a personalized, dynamically filtered college dashboard.

---

## Key Features

### AI Resume Parsing Pipeline
Integrates the Gemini 2.5 API with a custom network failsafe to extract unstructured PDF resume data into structured, actionable JSON format.

### ML Admission Predictor
Utilizes a Python Flask microservice to process applicant datasets via Pandas and run logistic regression, returning highly accurate admission probabilities.

### Interactive "What-If" Engine
An algorithmic UI feature allowing users to simulate how boosting their GPA, internships, or projects dynamically shifts their college tiers (Safe, Target, Dream) in real time.

### Algorithmic Skill-Gap Analysis
Cross-references parsed applicant data against university benchmarks to generate personalized learning roadmaps.

### Secure Authentication Flow
Robust JWT-based authentication system with Bcrypt password hashing, global React Context state management, and protected frontend routing.

### High-Performance Querying
Optimized MongoDB database schema utilizing compound indexing to accelerate dynamic, multi-parameter filtering queries from **O(N)** to approximately **O(log N)**.

---

## Tech Stack

### Frontend Architecture
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** Context API

### Backend API & Database
- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Security:** JSON Web Tokens (JWT), Bcrypt.js

### AI & Machine Learning Microservice
- **Server:** Python 3, Flask
- **Data Processing:** Pandas
- **AI Integration:** Google Gemini 2.5 API

---

## Project Structure

```text
smart-admit/
├── backend/                  # Node.js & Express Core API
│   ├── models/               # Mongoose schemas (User, College, etc.)
│   ├── routes/               # API endpoints (Auth, Colleges)
│   ├── .env                  # Core environment variables
│   └── server.js             # Main backend entry point
├── frontend/                 # React.js Application
│   ├── src/
│   │   ├── components/       # Reusable UI elements (Cards, Sliders, Uploader)
│   │   ├── context/          # Global state (AuthContext)
│   │   ├── pages/            # View components (Home, Dashboard, Login, Signup)
│   │   ├── App.jsx           # Main router configuration
│   │   └── main.jsx          # React DOM renderer
│   └── package.json
└── python-ai-server/         # ML & Parsing Microservice
    ├── app.py                # Flask server entry point
    ├── model.pkl             # Trained logistic regression model
    └── requirements.txt      # Python dependencies
```

---

## How It Works

The application operates on a dual-server microservice architecture to separate heavy AI/ML processing from core routing and database management.

### 1. User Authentication
A user signs up or logs in via the React frontend. The Node.js backend encrypts the password and issues a secure JWT token.

### 2. Data Ingestion
The authenticated user uploads their resume PDF via the dashboard.

### 3. Delegation
The Node.js server receives the PDF and securely forwards it to the isolated Python ML Microservice.

### 4. AI Parsing & Prediction
The Python server utilizes the Gemini API to parse the unstructured text into a structured profile. It then runs this profile through a Pandas-cleaned logistic regression model to determine a base admission probability.

### 5. Matching & Rendering
The Node.js server takes the predicted profile, runs an optimized **O(log N)** compound query against the MongoDB database to find matching colleges, and returns the customized list to the React frontend for display.

---

## How to Run Locally

To run this project locally, you will need to start both backend servers and the frontend environment simultaneously.

### 1. Clone the Repository

```bash
git clone https://github.com/samdharasoc/smart-admit.git
cd smart-admit
```

---

### 2. Setup the Core API (Node.js)

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
GEMINI_API_KEY=your_google_gemini_key
```

Start the backend server:

```bash
npm run dev
```

---

### 3. Setup the ML Microservice (Python)

Open a new terminal split/tab:

```bash
cd python-ai-server
pip install -r requirements.txt
python app.py
```

---

### 4. Setup the Client (React)

Open a third terminal split/tab:

```bash
cd frontend
npm install
npm run dev
```

Navigate to:

```text
http://localhost:5173
```

to view the application.

---

## Contributors

- Samhita Renu
- Nandini Mehrotra