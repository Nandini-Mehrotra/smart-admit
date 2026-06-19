import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, LogOut, User, Bookmark, Edit3, Save, X } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
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
    return <div className="p-8">Loading profile...</div>;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSaveProfile = async () => {
  try {
    const token = currentUser.token;

    const res = await fetch("http://localhost:5001/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Profile save failed");
      return;
    }

    const updatedUser = {
      ...data.user,
      token,
    };

    login(updatedUser);
    alert("Profile saved successfully");
    setIsEditing(false);
  } catch (error) {
    console.log(error);
    alert("Profile save failed");
  }
};
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const bookmarks = currentUser.bookmarks || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

        <button
          onClick={handleLogout}
          className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      <main className="p-8 max-w-6xl mx-auto">
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
                <User className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentUser.name}
                </h2>
                <p className="text-gray-500">{currentUser.email}</p>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <InfoBox label="College" value={formData.college || "Not added yet"} />
              <InfoBox label="Year" value={formData.year || "Not added yet"} />
              <InfoBox label="GPA / CGPA" value={formData.gpa || "Not added yet"} />
              <InfoBox
                label="Max Budget"
                value={formData.maxBudget ? `₹${formData.maxBudget}` : "Not added yet"}
              />
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">
                Update academic preferences
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="College / Institute"
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
                  label="GPA / CGPA"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="e.g. 9.06"
                />

                <InputField
                  label="Max Budget"
                  name="maxBudget"
                  type="number"
                  value={formData.maxBudget}
                  onChange={handleChange}
                  placeholder="e.g. 500000"
                />
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <div className="w-11 h-11 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mr-3">
                <Bookmark className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Bookmarked Colleges
                </h2>
                <p className="text-sm text-gray-500">
                  Colleges you saved from your dashboard
                </p>
              </div>
            </div>

            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
              {bookmarks.length} saved
            </span>
          </div>

          {bookmarks.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
              No bookmarks yet. Go to dashboard and save colleges you like.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map((college, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition"
                >
                  <h3 className="font-bold text-gray-900 text-lg">
                    {college.name || college}
                  </h3>

                  {college.state && (
                    <p className="text-sm text-gray-500 mt-1">
                      {college.state}, {college.country || "India"}
                    </p>
                  )}

                  {college.tuition && (
                    <p className="text-sm font-medium text-gray-700 mt-2">
                      ₹{college.tuition.toLocaleString()} / year
                    </p>
                  )}

                  {college.tier && (
                    <span className="inline-block mt-3 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {college.tier}
                    </span>
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

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-gray-900 font-semibold mt-1">{value}</p>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
      />
    </div>
  );
}