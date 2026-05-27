import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText } from 'lucide-react'; //for icons

export default function ResumeUploader() {
  const [acceptedFile, setAcceptedFile] = useState(null); //to remember wht happened (as in which file was uploaded)

  // This function runs the exact moment a file is dropped
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setAcceptedFile(acceptedFiles[0]);
      console.log("File captured:", acceptedFiles[0].name);
      //now send this to backedn
    }
  }, []);

  //only pdf accpeted, and max only 1 file
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
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
          <div className="flex items-center text-green-700">
            <FileText className="w-5 h-5 mr-3" />
            <span className="font-medium">{acceptedFile.name}</span>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700">
            Analyze Resume
          </button>
        </div>
      )}
    </div>
  );
}