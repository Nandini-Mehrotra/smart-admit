import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Home from "./pages/Home"; 
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Profile from "./pages/Profile";
import { ThemeProvider } from "./context/ThemeContext"; 

function App() {
  return (
    <ThemeProvider>
      {/* The Toaster sits at the very top of your app so it's always visible */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;