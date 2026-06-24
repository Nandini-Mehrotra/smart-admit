import { useContext, useState, createContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, LogOut, User, Bookmark, Edit3, Save, X, GraduationCap, Calendar, Target, DollarSign, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  // Optional chaining or mock navigate to prevent crash in preview
  const navigate = () => {}; 
  const { user, login, logout } = useContext(AuthContext);

  const storedUser = JSON.parse(localStorage.getItem("smartAdmitUser"));
  const currentUser = storedUser || user;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    college: currentUser?.profile?.college || "",
    year: currentUser?.profile?.year || "",
    gpa: currentUser?.profile?.gpa || "",
    maxBudget: currentUser?.profile?.maxBudget || "",
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading command center...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 1. The Async Database Save Fix (Now with Premium Toasts)
  const handleSaveProfile = async () => {
    const toastId = toast.loading("Saving your profile...");
    try {
      const token = currentUser.token;

      const response = await fetch("import.meta.env.VITE_API_URL/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("smartAdmitUser", JSON.stringify(data.user));
        login(data.user);
        toast.success("Profile updated successfully!", { id: toastId });
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to save profile", { id: toastId });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Network error. Is the backend running?", { id: toastId });
    }
  };

  // 2. The Logout Fix
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 3. The Bookmarks Data
  const bookmarks = currentUser.bookmarks || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* --- PREMIUM NAVBAR --- */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link
          to="/dashboard"
          className="flex items-center text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Command Center</h1>

        <button
          onClick={handleLogout}
          className="inline-flex items-center bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      <main className="p-4 sm:p-8 max-w-6xl mx-auto mt-4">
        
        {/* --- PROFILE SECTION --- */}
        <section className="bg-white ring-1 ring-slate-200 rounded-3xl shadow-sm p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 mr-6 shrink-0">
                <User className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {currentUser.name}
                </h2>
                <p className="text-slate-500 font-medium">{currentUser.email}</p>
                <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold ring-1 ring-inset ring-indigo-200">
                  Applicant Profile
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center bg-white text-slate-700 px-5 py-2.5 rounded-xl font-bold ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all shadow-sm w-full md:w-auto justify-center"
              >
                <Edit3 className="w-4 h-4 mr-2 text-slate-400" />
                Edit Strategy
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoBox icon={<GraduationCap />} label="Current Institute" value={formData.college || "Not added yet"} />
              <InfoBox icon={<Calendar />} label="Graduation Year" value={formData.year || "Not added yet"} />
              <InfoBox icon={<Target />} label="GPA / CGPA" value={formData.gpa || "Not added yet"} />
              <InfoBox icon={<DollarSign />} label="Max Budget" value={formData.maxBudget ? `₹${Number(formData.maxBudget).toLocaleString()}` : "Not added yet"} />
            </div>
          ) : (
            <div className="bg-slate-50/50 ring-1 ring-inset ring-slate-200 rounded-2xl p-6 md:p-8 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-indigo-500" /> Update Academic Strategy
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Current College / Institute"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. IIIT Allahabad"
                />

                <InputField
                  label="Current Year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g. 3rd Year"
                />

                <InputField
                  label="Current GPA / CGPA"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="e.g. 9.06"
                />

                <InputField
                  label="Max Budget (USD)"
                  name="maxBudget"
                  type="number"
                  value={formData.maxBudget}
                  onChange={handleChange}
                  placeholder="e.g. 500000"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* --- BOOKMARKS SECTION --- */}
        <section className="bg-white ring-1 ring-slate-200 rounded-3xl shadow-sm p-8 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mr-4 ring-1 ring-inset ring-amber-100">
                <Bookmark className="w-6 h-6 fill-amber-500" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Dream List
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-0.5">
                  Your saved college targets
                </p>
              </div>
            </div>

            <span className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-sm font-bold ring-1 ring-inset ring-amber-200 shadow-sm">
              {bookmarks.length} {bookmarks.length === 1 ? 'School' : 'Schools'} Saved
            </span>
          </div>

          {bookmarks.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-12 text-center">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">Your list is empty</h3>
              <p className="text-slate-500 font-medium">Head back to the dashboard to start saving your top matches.</p>
              <Link to="/dashboard" className="inline-block mt-6 text-indigo-600 font-bold hover:text-indigo-700 hover:underline underline-offset-4">
                Explore Colleges &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookmarks.map((college, index) => (
                <div
                  key={index}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full"
                >
                  <h3 className="font-extrabold text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors mb-4">
                    {college.name || college}
                  </h3>

                  <div className="space-y-2.5 mt-auto">
                    {college.state && (
                      <div className="flex items-center text-sm font-medium text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <span className="truncate">{college.state}, {college.country || "India"}</span>
                      </div>
                    )}

                    {college.tuition && (
                      <div className="flex items-center text-sm font-medium text-slate-900">
                        <DollarSign className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                        ₹{college.tuition.toLocaleString()} <span className="text-slate-400 font-normal ml-1">/ yr</span>
                      </div>
                    )}
                  </div>

                  {college.tier && (
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Category</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                        college.tier === 'Safe' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                        college.tier === 'Target' ? 'bg-amber-50 text-amber-800 ring-amber-600/20' :
                        'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                      }`}>
                        {college.tier}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// --- MICRO COMPONENTS ---

function InfoBox({ label, value, icon }) {
  return (
    <div className="bg-slate-50 ring-1 ring-inset ring-slate-100 rounded-2xl p-5 flex flex-col justify-center">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mb-2">
        {icon && <span className="w-3.5 h-3.5 mr-1.5 opacity-70">{icon}</span>}
        {label}
      </p>
      <p className="text-slate-900 font-extrabold truncate text-lg">{value}</p>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 transition-all shadow-sm"
      />
    </div>
  );
}