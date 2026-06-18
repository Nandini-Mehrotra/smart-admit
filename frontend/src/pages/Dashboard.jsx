import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

import ResumeUploader from "../components/ResumeUploader";
import SidebarFilters from "../components/SidebarFilters";
import CollegeCard from "../components/CollegeCard";
import WhatifSliders from "../components/WhatifSliders";

export default function Dashboard() {
  // --- Global Auth State ---
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- Dashboard States ---
  const [colleges, setColleges] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]); 
  const [selectedStates, setSelectedStates] = useState([]);       
  const [maxBudget, setMaxBudget] = useState("");
  const [adjustments, setAdjustments] = useState({
    gpaBoost: 0,
    internshipBoost: 0,
    projectBoost: 0,
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // --- Logout Logic ---
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // --- ML & Probability Logic ---
  const calculateAdjustedProbability = (baseProbability) => {
    let updatedProbability =
      baseProbability +
      adjustments.gpaBoost * 8 +
      adjustments.internshipBoost * 5 +
      adjustments.projectBoost * 3;

    if (updatedProbability > 99) updatedProbability = 99;
    if (updatedProbability < 1) updatedProbability = 1;

    return Math.round(updatedProbability);
  };

  const getDynamicTier = (probability) => {
    if (probability >= 80) return "Safe";
    if (probability >= 60) return "Target";
    return "Dream";
  };

  const baseOverallProbability = aiAnalysis?.mlResult?.prediction?.admissionProbability || 0;
  const simulatedOverallProbability = aiAnalysis ? calculateAdjustedProbability(baseOverallProbability) : 0;
  const simulatedOverallTier = getDynamicTier(simulatedOverallProbability);

  // --- Fetch Colleges ---
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
      {/* --- Top Navigation Bar --- */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Link>
        
        <div className="flex items-center gap-6">
          <span className="text-gray-700 font-medium">
            Welcome, {user?.name || "Student"}!
          </span>
          <Link
            to="/profile"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            My Profile
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </button>
        </div>
      </div>

      <div className="p-8 flex flex-col lg:flex-row gap-8">
        {/* --- Sidebar --- */}
        <aside className="w-full lg:w-72 space-y-6 flex-shrink-0">
          <SidebarFilters
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
            maxBudget={maxBudget}
            setMaxBudget={setMaxBudget}
          />

          <WhatifSliders
            adjustments={adjustments}
            setAdjustments={setAdjustments}
          />
        </aside>

        {/* --- Main Content --- */}
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
              onReset={() => setAiAnalysis(null)} 
              simulatedProbability={simulatedOverallProbability}
              simulatedTier={simulatedOverallTier}
            />
          </div>

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
                  colleges.map((college) => {
                    const baseProbability = aiAnalysis?.mlResult?.prediction?.admissionProbability || 70;
                    const adjustedProbability = calculateAdjustedProbability(baseProbability);
                    const dynamicTier = getDynamicTier(adjustedProbability);

                    return (
                      <CollegeCard
                        key={college._id}
                        college={{
                          ...college,
                          adjustedProbability: adjustedProbability,
                        }}
                        aiTier={dynamicTier}
                        skillGap={aiAnalysis?.extractedData?.skillGap}
                      />
                    );
                  })
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