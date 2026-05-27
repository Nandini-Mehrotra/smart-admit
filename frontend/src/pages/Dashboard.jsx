import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ResumeUploader from '../components/ResumeUploader'; // Import it!

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Link to="/" className="flex items-center text-blue-600 mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Profile Setup</h1>
        <p className="text-gray-600 mt-2 text-center">Upload your resume to get started.</p>

        {/* Drop the component right here */}
        <ResumeUploader />
      </div>
    </div>
  );
}