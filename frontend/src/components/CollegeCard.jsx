import { useState } from "react";
import { ExternalLink, MapPin, DollarSign, Target, AlertCircle, Sparkles, Star } from "lucide-react";

export default function CollegeCard({ college, aiTier, skillGap = [] }) {
  // Add state to toggle the skill gap drop-down
  const [showGap, setShowGap] = useState(false);

  // Dynamic UI Configuration
  const tierConfig = {
    Safe: {
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: <Target className="w-4 h-4 mr-1" />,
      message: "Strong profile match. High probability of admission."
    },
    Target: { 
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <AlertCircle className="w-4 h-4 mr-1" />,
      message: "Competitive. Your profile is within the average admitted range."
    },
    Reach: { 
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <AlertCircle className="w-4 h-4 mr-1" />,
      message: "Stretch goal. You meet baseline criteria but face high competition."
    },
    Dream: {
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: <ExternalLink className="w-4 h-4 mr-1" />,
      message: "Highly competitive. See Skill Gap Checklist to improve chances."
    }
  };

  const activeTier = tierConfig[aiTier] || tierConfig["Target"]; // Fallback
  const handleBookmark = () => {
  const storedUser = JSON.parse(localStorage.getItem("smartAdmitUser"));

  if (!storedUser) {
    alert("Please login first");
    return;
  }

  const oldBookmarks = storedUser.bookmarks || [];

  const alreadyBookmarked = oldBookmarks.some(
    (item) => item.name === college.name
  );

  if (alreadyBookmarked) {
    alert("College already bookmarked");
    return;
  }

  const bookmarkCollege = {
    name: college.name,
    state: college.state,
    country: college.country || "India",
    tuition: college.tuition,
    tier: aiTier,
    probability: college.adjustedProbability || null,
  };

  const updatedUser = {
    ...storedUser,
    bookmarks: [...oldBookmarks, bookmarkCollege],
  };

  localStorage.setItem("smartAdmitUser", JSON.stringify(updatedUser));

  alert("College bookmarked successfully");
};

  return (
    <article className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col h-full">
      
      {/* Top Banner & Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors pr-4">
            {college.name}
          </h3>
          
          {/* Dynamic Tier Badge */}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${activeTier.color}`}>
            {activeTier.icon}
            {aiTier}
          </span>
        </div>

        {/* Location & Details */}
        <div className="flex flex-col space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {college.state}, {college.country || "India"}
          </div>
          <div className="flex items-center font-medium text-gray-900">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            ₹{college.tuition.toLocaleString()} / year
          </div>
          {college.adjustedProbability && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-blue-700">
                Admission Chance: {college.adjustedProbability}%
              </p>

              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${college.adjustedProbability}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tri-Tier Context / Skill Gap Section */}
      <div className="mt-auto border-t border-gray-100 bg-gray-50 p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">AI Match Insight</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {activeTier.message}
        </p>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          <a 
            href={`https://www.google.com/search?q=${college.name}+admissions`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Official Site <ExternalLink className="w-3 h-3 ml-2" />
          </a>

          <button
            onClick={handleBookmark}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-yellow-300 shadow-sm text-sm font-medium rounded-lg text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors"
          >
            Bookmark <Star className="w-3 h-3 ml-2" />
          </button>
          
          {/* Interactive Toggle Button */}
          {aiTier === "Dream" && (
            <button 
              onClick={() => setShowGap(!showGap)}
              className="flex-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100 flex justify-center items-center"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              {showGap ? "Hide Gap" : "View Skill Gap"}
            </button>
          )}
        </div>

        {/* The Dropdown Content */}
        {showGap && skillGap.length > 0 && (
          <div className="mt-4 p-3 bg-white border border-indigo-100 rounded-lg shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-xs font-bold text-indigo-800 uppercase mb-2">Required Level-Up</p>
            <div className="flex flex-wrap gap-2">
              {skillGap.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium border border-indigo-100">
                  + {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}