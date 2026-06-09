import { ExternalLink, MapPin, DollarSign, Target, AlertCircle } from "lucide-react";

export default function CollegeCard({ college, aiTier }) {
  // Dynamic UI Configuration based on your Phase 5 Tri-Tier Categorization
  const tierConfig = {
    Safe: {
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: <Target className="w-4 h-4 mr-1" />,
      message: "Strong profile match. High probability of admission."
    },
    Reach: { // or "Target" depending on your ML output
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <AlertCircle className="w-4 h-4 mr-1" />,
      message: "Competitive. Your profile is within the average admitted range."
    },
    Dream: {
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: <ExternalLink className="w-4 h-4 mr-1" />,
      message: "Highly competitive. See Skill Gap Checklist to improve chances."
    }
  };

  const activeTier = tierConfig[aiTier] || tierConfig["Reach"]; // Fallback

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
        </div>
      </div>

      {/* Tri-Tier Context / Skill Gap Stub */}
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
          
          {/* We will wire this up when we build the Phase 6 feature! */}
          {aiTier === "Dream" && (
            <button className="flex-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100">
              View Skill Gap
            </button>
          )}
        </div>
      </div>
    </article>
  );
}