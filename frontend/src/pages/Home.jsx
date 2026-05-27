import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Smart Admit</h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
        AI-powered college recommendations based on your unique resume and goals.
      </p>
      {/* This Link acts like an <a> tag, but doesn't reload the page! */}
      <Link 
        to="/dashboard" 
        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Get Recommendations
      </Link>
    </div>
  );
}