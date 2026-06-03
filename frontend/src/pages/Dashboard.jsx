import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ResumeUploader from "../components/ResumeUploader";
import SidebarFilters from "../components/SidebarFilters";
import CollegeCard from "../components/CollegeCard";

export default function Dashboard() {
  const [colleges, setColleges] = useState([]);
  const [state, setState] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const params = new URLSearchParams();

        if (state) params.append("state", state);
        if (maxBudget) params.append("maxBudget", maxBudget);

        const response = await fetch(
          `http://localhost:5001/api/colleges/filter?${params.toString()}`
        );

        const result = await response.json();
        if (result.data && result.data.length > 0) {
          setColleges(result.data);
        }  // using mock data for now since backend isn't fully ready yet
        else {
          setColleges([
            {
              _id: 1,
              name: "IIIT Hyderabad",
              state: "Telangana",
              tuition: 450000,
            },
            {
              _id: 2,
              name: "BITS Pilani",
              state: "Rajasthan",
              tuition: 600000,
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
      }
    };

    fetchColleges();
  }, [state, maxBudget]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">
          Smart Admit Dashboard
        </h1>
      </div>

      <div className="p-8 flex flex-col lg:flex-row gap-8">
        <SidebarFilters
          state={state}
          setState={setState}
          maxBudget={maxBudget}
          setMaxBudget={setMaxBudget}
        />

        <main className="flex-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-10">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Upload Your Resume
            </h2>

            <p className="text-gray-500 text-center mt-3">
              Analyze your profile and get personalized college recommendations.
            </p>

            <ResumeUploader />
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              Recommended Colleges
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {colleges.map((college) => (
                <CollegeCard key={college._id} college={college} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}