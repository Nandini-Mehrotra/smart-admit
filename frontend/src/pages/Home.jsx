import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // 1. Import the brain!

export default function Home() {
  const { user } = useContext(AuthContext); // 2. Check if user exists

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
        Smart Admit
      </h1>
      <p className="text-xl text-gray-500 max-w-2xl mb-8">
        AI-powered college recommendations based on your unique resume and goals.
      </p>

      {/* 3. The Smart Logic */}
      <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
        {user ? (
          <Link 
            to="/dashboard" 
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link 
              to="/login" 
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Log in
            </Link>
            <Link 
              to="/signup" 
              className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              Sign up free
            </Link>
          </>
        )}
      </div>
    </div>
  );
}