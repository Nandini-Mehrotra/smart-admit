import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, LogOut, AlertCircle, Sun, Moon } from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ResumeUploader from "../components/ResumeUploader";
import SidebarFilters from "../components/SidebarFilters";
import CollegeCard from "../components/CollegeCard";
import WhatifSliders from "../components/WhatifSliders";

// --- PREMIUM SKELETON LOADER ---
const SkeletonGrid = () => (
  <div className="w-full mt-8 animate-in fade-in duration-500">
    <div className="flex items-center space-x-3 mb-6">
      <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((n) => (
        <div key={n} className="bg-white dark:bg-slate-800 rounded-3xl p-7 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm animate-pulse flex flex-col h-72 transition-colors duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-2/3"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 shrink-0"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 shrink-0"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3"></div>
            </div>
          </div>
          <div className="mt-auto flex gap-2">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/2"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Dashboard() {
  // --- Global States ---
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme(); 
  const navigate = useNavigate();

  // --- Dashboard States ---
  const [colleges, setColleges] = useState([]);
  const [isFetchingColleges, setIsFetchingColleges] = useState(false);
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
    navigate("/login");
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
      setIsFetchingColleges(true);
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
      } finally {
        setIsFetchingColleges(false);
      }
    };

    fetchColleges();
  }, [selectedCountries, selectedStates, maxBudget]);

  // Pre-process colleges to inject dynamic probabilities before rendering
  const processedColleges = colleges.map(college => {
    const baseProb = aiAnalysis?.mlResult?.prediction?.admissionProbability || 70;
    const adjustedProb = calculateAdjustedProbability(baseProb);
    const dynamicTier = getDynamicTier(adjustedProb);
    return { ...college, adjustedProbability: adjustedProb, dynamicTier };
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      {/* --- Top Navigation Bar --- */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-8 py-5 flex items-center justify-between shadow-sm sticky top-0 z-50 transition-colors duration-300">
        <Link to="/" className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Link>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-slate-700 dark:text-slate-200 font-medium hidden md:block transition-colors duration-300">
            Welcome, {user?.name || "Student"}!
          </span>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link
            to="/profile"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all"
          >
            My Profile
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Log Out</span>
          </button>
        </div>
      </div>

      <div className="p-8 flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto">
        {/* --- Sidebar --- */}
        <aside className="w-full lg:w-80 space-y-6 flex-shrink-0">
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
          <div className="bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 rounded-3xl p-8 shadow-sm mb-10 transition-colors duration-300">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center tracking-tight transition-colors duration-300">AI Resume Parser</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mt-3 font-medium transition-colors duration-300">
              Drop your resume below to unlock dynamic college predictions and strategy gaps.
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

          {/* SKELETON LOADER: Shows while fetching data */}
          {isFetchingColleges && <SkeletonGrid />}

          {/* AI MATCHES: Rendered in categorized lanes once analysis is complete */}
          {aiAnalysis && !isFetchingColleges && processedColleges.length > 0 && (
            <div className="mt-12 space-y-12">
              
              {/* 1. SAFE BETS LANE */}
              {processedColleges.filter(c => c.dynamicTier === "Safe").length > 0 && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 flex items-center transition-colors duration-300">
                    <span className="w-2.5 h-8 bg-emerald-400 rounded-full mr-3 shadow-sm shadow-emerald-400/50"></span>
                    Your Safe Bets
                  </h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {processedColleges.filter(c => c.dynamicTier === "Safe").map((college) => (
                      <CollegeCard key={college._id} college={college} aiTier="Safe" skillGap={aiAnalysis?.extractedData?.skillGap} />
                    ))}
                  </div>
                </section>
              )}

              {/* 2. TARGET SCHOOLS LANE */}
              {processedColleges.filter(c => c.dynamicTier === "Target").length > 0 && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 flex items-center transition-colors duration-300">
                    <span className="w-2.5 h-8 bg-amber-400 rounded-full mr-3 shadow-sm shadow-amber-400/50"></span>
                    Target Schools
                  </h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {processedColleges.filter(c => c.dynamicTier === "Target").map((college) => (
                      <CollegeCard key={college._id} college={college} aiTier="Target" skillGap={aiAnalysis?.extractedData?.skillGap} />
                    ))}
                  </div>
                </section>
              )}

              {/* 3. DREAM & REACH SCHOOLS LANE */}
              {processedColleges.filter(c => c.dynamicTier === "Dream" || c.dynamicTier === "Reach").length > 0 && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 flex items-center transition-colors duration-300">
                    <span className="w-2.5 h-8 bg-indigo-500 rounded-full mr-3 shadow-sm shadow-indigo-500/50"></span>
                    Dream Schools
                  </h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {processedColleges.filter(c => c.dynamicTier === "Dream" || c.dynamicTier === "Reach").map((college) => (
                      <CollegeCard key={college._id} college={college} aiTier="Dream" skillGap={aiAnalysis?.extractedData?.skillGap} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* NO RESULTS FALLBACK */}
          {aiAnalysis && !isFetchingColleges && processedColleges.length === 0 && (
            <div className="mt-8 p-12 bg-white dark:bg-slate-800 rounded-3xl ring-1 ring-slate-200 dark:ring-slate-700 text-center shadow-sm transition-colors duration-300">
              <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">No matching colleges found</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors duration-300">Try adjusting your budget or target location in the sidebar.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}