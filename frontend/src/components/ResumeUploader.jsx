import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Loader2, CheckCircle, Sparkles, Target } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeUploader({ selectedCountries, selectedStates, maxBudget, onAnalysisSuccess, onReset, simulatedProbability, simulatedTier }) {  
  const [acceptedFile, setAcceptedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 
  const [predictionData, setPredictionData] = useState(null); 

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setAcceptedFile(acceptedFiles[0]);
      setPredictionData(null); 
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (selectedCountries.length === 0) {
      toast.error("Please select a Target Country in the sidebar.");
      return;
    }

    if (!maxBudget) {
      toast.error("Please enter your Max Budget in the sidebar.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Analyzing your profile...");

    const formData = new FormData();
    formData.append('resume', acceptedFile); 
    formData.append('targetCountry', selectedCountries[0]); 
    formData.append('targetState', selectedStates.length > 0 ? selectedStates[0] : "Any");    
    formData.append('maxBudget_USD', maxBudget);

    try {
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.status === "success") {
        setPredictionData(data);
        if (onAnalysisSuccess) onAnalysisSuccess(data);
        toast.success("AI Analysis Complete!", { id: toastId });
      } else {
        toast.error("Something went wrong with the AI analysis.", { id: toastId });
      }

    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Is your backend running?", { id: toastId });
    } finally {
      setIsUploading(false); 
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 transition-colors duration-300">
      {/* --- PREMIUM DROPZONE UI --- */}
      <div 
        {...getRootProps()} 
        className={`relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-12 ${
          isDragActive 
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 scale-[1.02]" 
            : acceptedFile 
              ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-500/10"
              : "border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500"
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${isDragActive ? 'opacity-100' : ''}`} />
        <input {...getInputProps()} />
        
        <div className="relative z-20 flex flex-col items-center text-center">
          {acceptedFile ? (
            <>
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-4 ring-4 ring-indigo-50 dark:ring-indigo-500/10 transition-colors duration-300">
                <CheckCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">Resume Ready</h3>
              <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/20 px-4 py-1.5 rounded-full ring-1 ring-inset ring-indigo-200 dark:ring-indigo-500/30 transition-colors duration-300">
                {acceptedFile.name}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 transition-colors duration-300">Click or drag a new file to replace</p>
            </>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 shadow-sm ${isDragActive ? 'bg-blue-600 text-white scale-110 shadow-blue-500/30' : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-indigo-200 dark:group-hover:ring-indigo-600 group-hover:shadow-indigo-500/10'}`}>
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
                {isDragActive ? "Drop it here!" : "Upload your Resume"}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 transition-colors duration-300">
                Drag and drop your PDF, or <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-800 underline-offset-4 group-hover:decoration-indigo-600 dark:group-hover:decoration-indigo-300 transition-colors">browse files</span>
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">
                <span>PDF Format</span>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                <span className="flex items-center"><Sparkles className="w-3 h-3 mr-1 text-amber-500 dark:text-amber-400" /> AI Powered</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- ACTION BAR --- */}
      {acceptedFile && !predictionData && (
        <div className="mt-6 flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-4 transition-colors duration-300">
          <div className="flex items-center text-slate-600 dark:text-slate-300 transition-colors duration-300">
            <FileText className="w-5 h-5 mr-3 text-indigo-500 dark:text-indigo-400" />
            <span className="font-medium text-sm">Ready for AI Analysis</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setAcceptedFile(null);
                setPredictionData(null);
                if (onReset) onReset(); 
              }} 
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
              disabled={isUploading}
            >
              <X className="w-5 h-5" />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAnalyze();
              }}
              disabled={isUploading}
              className="bg-indigo-600 dark:bg-indigo-500 flex items-center text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-indigo-600/20 dark:shadow-indigo-900/50 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Profile
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* --- AI RESULTS --- */}
      {predictionData && (
        <div className="mt-8 p-8 bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-bottom-8 duration-500 transition-colors duration-300">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mr-4 transition-colors duration-300">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">AI Analysis Complete</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl ring-1 ring-inset ring-blue-100/50 dark:ring-blue-800/50 transition-colors duration-300">
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 transition-colors duration-300">Admission Probability</p>
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                {simulatedProbability || predictionData?.mlResult?.prediction?.admissionProbability || "N/A"}%
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl ring-1 ring-inset ring-emerald-100/50 dark:ring-emerald-800/50 transition-colors duration-300">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 transition-colors duration-300">Profile Category</p>
              <p className="text-5xl font-black text-emerald-700 dark:text-emerald-400 transition-colors duration-300">
                {simulatedTier || predictionData?.mlResult?.prediction?.tier || "Unknown"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 transition-colors duration-300">Detected Top Skills</p>
            <div className="flex flex-wrap gap-2">
              {predictionData?.extractedData?.skills ? (
                predictionData.extractedData.skills
                  .split('-')
                  .filter((skill) => skill.trim() !== '')
                  .map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold ring-1 ring-inset ring-slate-200 dark:ring-slate-600 transition-colors duration-300">
                      {skill}
                    </span>
                  ))
              ) : (
                <span className="text-slate-400 dark:text-slate-500 text-sm italic transition-colors duration-300">No skills extracted</span>
              )}
            </div>
          </div>

          {predictionData?.extractedData?.skillGap && predictionData.extractedData.skillGap.length > 0 && (
            <div className="mt-8 p-6 bg-indigo-50/50 dark:bg-indigo-500/10 ring-1 ring-inset ring-indigo-100 dark:ring-indigo-500/20 rounded-2xl transition-colors duration-300">
              <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-4 flex items-center transition-colors duration-300">
                <Target className="w-4 h-4 mr-2" /> Missing Skills for "Dream" Tier
              </p>
              <div className="flex flex-wrap gap-2">
                {predictionData.extractedData.skillGap.map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-bold shadow-sm ring-1 ring-inset ring-indigo-200 dark:ring-indigo-700 transition-colors duration-300">
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}