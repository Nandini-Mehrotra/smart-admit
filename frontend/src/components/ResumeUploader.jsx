import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Loader2, AlertCircle } from 'lucide-react';

export default function ResumeUploader({ selectedCountries, selectedStates, maxBudget, onAnalysisSuccess, onReset, simulatedProbability, simulatedTier, }) {  
  const [acceptedFile, setAcceptedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 
  const [predictionData, setPredictionData] = useState(null); 
  const [validationError, setValidationError] = useState(""); 

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setAcceptedFile(acceptedFiles[0]);
      setPredictionData(null); 
      setValidationError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (selectedCountries.length === 0) {
      setValidationError("Please select at least one Target Country from the sidebar.");
      return;
    }

    if (!maxBudget) {
      setValidationError("Please enter your Max Budget in the sidebar.");
      return;
    }

    setValidationError("");
    setIsUploading(true);

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
      console.log("🕵️‍♂️ FRONTEND TRUTH:", data);
      
      if (data.status === "success") {
        setPredictionData(data);
        if (onAnalysisSuccess) onAnalysisSuccess(data);
      } else {
        setValidationError("Something went wrong with the AI analysis.");
      }

    } catch (error) {
      console.error("Upload failed:", error);
      setValidationError("Upload failed. Is your backend running?");
    } finally {
      setIsUploading(false); 
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {validationError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm font-medium">{validationError}</p>
        </div>
      )}

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`w-12 h-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        
        {isDragActive ? (
          <p className="text-lg font-semibold text-blue-500">Drop your resume here...</p>
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">Drag & drop your resume PDF</p>
            <p className="text-sm text-gray-500 mt-2">or click to browse your files</p>
          </div>
        )}
      </div>

      {acceptedFile && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center text-green-700 truncate mr-4">
            <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium truncate">{acceptedFile.name}</span>
          </div>
          
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button 
              onClick={() => {
                setAcceptedFile(null);
                setPredictionData(null);
                setValidationError("");
                if (onReset) onReset(); 
              }} 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              disabled={isUploading}
            >
              <X className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleAnalyze}
              disabled={isUploading}
              className="bg-green-600 flex items-center text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isUploading ? "Uploading..." : "Analyze"}
            </button>
          </div>
        </div>
      )}

      {predictionData && (
        <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold mb-4">🚀 AI Analysis Complete</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-semibold uppercase">Admission Probability</p>
              <p className="text-4xl font-extrabold text-blue-900">
                {simulatedProbability || predictionData?.mlResult?.prediction?.admissionProbability || "N/A"}%
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-semibold uppercase">Profile Category</p>
              <p className="text-4xl font-extrabold text-green-900">
                {simulatedTier || predictionData?.mlResult?.prediction?.tier || "Unknown"}
              </p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-700 mb-2">Detected Top Skills:</p>
            <div className="flex flex-wrap gap-2">
              {predictionData?.extractedData?.skills ? (
                predictionData.extractedData.skills
                  .split('-')
                  .filter((skill) => skill.trim() !== '')
                  .map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))
              ) : (
                <span className="text-gray-400 text-sm italic">No skills extracted</span>
              )}
            </div>
          </div>

          {/* NEW: Missing Skills / Skill Gap Section */}
          {predictionData?.extractedData?.skillGap && predictionData.extractedData.skillGap.length > 0 && (
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
              <p className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                📈 Missing Skills to reach "Dream" Tier:
              </p>
              <div className="flex flex-wrap gap-2">
                {predictionData.extractedData.skillGap.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-white border border-indigo-200 text-indigo-700 rounded-full text-sm font-medium shadow-sm">
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