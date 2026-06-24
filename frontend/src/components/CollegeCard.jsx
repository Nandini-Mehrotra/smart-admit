import { useState, useContext, createContext } from "react";
// import { AuthContext } from "../context/AuthContext";
const AuthContext = createContext({ user: null, login: () => {} });
import { ExternalLink, MapPin, DollarSign, Target, AlertCircle, Sparkles, Star, ChevronRight } from "lucide-react";

export default function CollegeCard({ college, aiTier, skillGap = [] }) {
  const [showGap, setShowGap] = useState(false);
  
  const { user, login } = useContext(AuthContext);
  const storedUser = JSON.parse(localStorage.getItem("smartAdmitUser"));
  const currentUser = user || storedUser;

  if (!college) return null;

  // Premium UI Configuration for Tiers
  const tierConfig = {
    Safe: {
      style: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
      Icon: Target, 
      message: "Strong profile match. High probability of admission."
    },
    Target: { 
      style: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20",
      Icon: AlertCircle,
      message: "Competitive. Your profile is within the average admitted range."
    },
    Reach: { 
      style: "bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-600/20",
      Icon: AlertCircle,
      message: "Stretch goal. You meet baseline criteria but face high competition."
    },
    Dream: {
      style: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20",
      Icon: Sparkles,
      message: "Highly competitive. See Skill Gap Checklist to improve chances."
    }
  };

  const safeAiTier = typeof aiTier === "string" ? aiTier : "Target";
  const activeTier = tierConfig[safeAiTier] || tierConfig["Target"];
  const TierIcon = activeTier.Icon;

  const isBookmarked = currentUser?.bookmarks?.some((b) => b?.name === college?.name);

  const handleBookmark = async () => {
    if (!currentUser) {
      alert("Please login first to bookmark colleges");
      return;
    }

    const bookmarkCollege = {
      name: college.name,
      state: college.state,
      country: college.country || "India",
      tuition: college.tuition,
      tier: safeAiTier,
      probability: college.adjustedProbability || null,
    };

    try {
      const response = await fetch("import.meta.env.VITE_API_URL/api/auth/bookmark", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ college: bookmarkCollege }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        localStorage.setItem("smartAdmitUser", JSON.stringify(data.user));
      } else {
        alert(data.message || "Failed to update bookmark");
      }
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
      alert("Network error. Is the backend running?");
    }
  };

  return (
    <article className="group relative bg-white rounded-3xl p-1 ring-1 ring-slate-200 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ease-out hover:-translate-y-1 overflow-hidden flex flex-col h-full">
      
      {/* Subtle top gradient line for depth */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="p-7 pb-5 flex-grow">
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300 pr-4 leading-tight">
            {college.name}
          </h3>
          
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${activeTier.style}`}>
            <TierIcon className="w-3.5 h-3.5 mr-1.5" />
            {safeAiTier}
          </span>
        </div>

        <div className="flex flex-col space-y-3 text-sm text-slate-600 font-medium">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 ring-1 ring-slate-100">
              <MapPin className="w-4 h-4 text-slate-400" />
            </div>
            {college.state}, {college.country || "India"}
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mr-3 ring-1 ring-emerald-100">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-slate-900">₹{college.tuition?.toLocaleString() ?? 0}</span> <span className="text-slate-400 ml-1 font-normal">/ year</span>
          </div>
          
          {college.adjustedProbability && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admission Chance</p>
                <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {college.adjustedProbability}%
                </p>
              </div>

              {/* Sleek Gradient Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden ring-1 ring-inset ring-slate-200">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${college.adjustedProbability}%` }}
                >
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Area & Insight Box */}
      <div className="mt-auto p-3">
        <div className="bg-slate-50/80 rounded-2xl p-5 ring-1 ring-inset ring-slate-100/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
            <Sparkles className="w-3 h-3 mr-1 text-indigo-400" /> AI Match Insight
          </p>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {activeTier.message}
          </p>

          <div className="mt-5 flex gap-2">
            <a 
              href={`https://www.google.com/search?q=${college.name}+admissions`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex justify-center items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 transition-all shadow-sm"
            >
              Site <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
            </a>

            <button
              onClick={handleBookmark}
              className={`flex-[1.5] inline-flex justify-center items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                isBookmarked 
                  ? "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100" 
                  : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md hover:shadow-slate-900/20"
              }`}
            >
              {isBookmarked ? "Saved" : "Bookmark"} 
              <Star className={`w-4 h-4 ml-1.5 ${isBookmarked ? "fill-indigo-600 text-indigo-600" : "text-slate-300"}`} />
            </button>
          </div>

          {/* Skill Gap Toggle Section */}
          {safeAiTier === "Dream" && (
            <div className="mt-3">
              <button 
                onClick={() => setShowGap(!showGap)}
                className="w-full group/btn flex items-center justify-between px-4 py-2.5 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-xl transition-all border border-indigo-100/50"
              >
                <span className="flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                  {showGap ? "Hide Strategy" : "Unlock Admissions Strategy"}
                </span>
                <ChevronRight className={`w-4 h-4 text-indigo-400 transition-transform duration-300 ${showGap ? "rotate-90" : ""}`} />
              </button>

              {/* Animated Expansion */}
              <div className={`grid transition-all duration-300 ease-in-out ${showGap && skillGap?.length > 0 ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="p-4 bg-white rounded-xl ring-1 ring-inset ring-indigo-100 shadow-sm shadow-indigo-100/50">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Required Level-Up</p>
                    <div className="flex flex-wrap gap-2">
                      {skillGap.map((skill, index) => {
                        const safeSkillLabel = typeof skill === "string" ? skill : (skill?.name || skill?.skill || "Skill needed");
                        return (
                          <span key={index} className="px-2.5 py-1.5 bg-gradient-to-b from-white to-slate-50 text-slate-700 rounded-lg text-xs font-semibold ring-1 ring-inset ring-slate-200 shadow-sm">
                            <span className="text-indigo-500 mr-1">+</span>{safeSkillLabel}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}