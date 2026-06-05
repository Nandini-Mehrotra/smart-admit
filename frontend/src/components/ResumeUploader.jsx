import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';

export default function ResumeUploader() {
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
    if (!acceptedFile) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('resume', acceptedFile); 

    try {
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log("Backend says:", data); 
      
      if (data.status === "success") {
        setPredictionData(data);
      } else {
        alert("Something went wrong with the AI analysis.");
      }

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Is your backend running?");
    } finally {
      setIsUploading(false); 
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {/* The Dropzone Area */}
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

      {/* Success Message Area */}
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

      {/* The AI Results Card with Bulletproof Rendering */}
      {predictionData && (
        <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-4">🚀 AI Analysis Complete</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-semibold uppercase">Admission Probability</p>
              <p className="text-4xl font-extrabold text-blue-900">
                {predictionData?.mlResult?.samplePrediction?.admissionProbability || "N/A"}%
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-semibold uppercase">Profile Category</p>
              <p className="text-4xl font-extrabold text-green-900">
                {predictionData?.mlResult?.samplePrediction?.category || "Unknown"}
              </p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-700 mb-2">Detected Top Skills:</p>
            <div className="flex flex-wrap gap-2">
              {(predictionData?.data?.extractedData?.topSkills || []).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}