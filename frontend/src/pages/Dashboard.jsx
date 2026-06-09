import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

import ResumeUploader from "../components/ResumeUploader";
import SidebarFilters from "../components/SidebarFilters";
import CollegeCard from "../components/CollegeCard";

export default function Dashboard() {
  const [colleges, setColleges] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]); 
  const [selectedStates, setSelectedStates] = useState([]);       
  const [maxBudget, setMaxBudget] = useState("");
  
  // NEW: State to hold the AI results from the uploader
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const params = new URLSearchParams();

        if (selectedCountries.length > 0) params.append("country", selectedCountries.join(","));
        if (selectedStates.length > 0) params.append("state", selectedStates.join(","));
        if (maxBudget) params.append("maxBudget", maxBudget);

        const response = await fetch(
          `http://localhost:5001/api/colleges/filter?${params.toString()}`
        );

        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          setColleges(result.data);
        } else {
          // If the database finds nothing, set it to an empty array. No more fake data!
          setColleges([]); 
        }
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
      }
    };

    fetchColleges();
  }, [selectedCountries, selectedStates, maxBudget]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Smart Admit Dashboard</h1>
      </div>

      <div className="p-8 flex flex-col lg:flex-row gap-8">
        <SidebarFilters
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          selectedStates={selectedStates}
          setSelectedStates={setSelectedStates}
          maxBudget={maxBudget}
          setMaxBudget={setMaxBudget}
        />

        <main className="flex-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-10">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Upload Your Resume</h2>
            <p className="text-gray-500 text-center mt-3">
              Analyze your profile and get personalized college recommendations.
            </p>

            <ResumeUploader 
              selectedCountries={selectedCountries} 
              selectedStates={selectedStates} 
              maxBudget={maxBudget} 
              onAnalysisSuccess={(data) => setAiAnalysis(data)} 
              onReset={() => setAiAnalysis(null)} // <-- CATCH THE SWITCH HERE
            />
          </div> {/* ADDED THIS MISSING CLOSING TAG */}

          {/* NEW: Only show colleges IF the AI analysis is completely finished */}
          {aiAnalysis && (
            <section className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center mb-5">
                <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Personalized Matches
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {colleges.length > 0 ? (
                  colleges.map((college) => (
                    <CollegeCard 
                      key={college._id} 
                      college={college} 
                      aiTier={aiAnalysis?.mlResult?.prediction?.tier} // <-- Pass Tier to the card!
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No colleges found matching your exact filters.</p>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}