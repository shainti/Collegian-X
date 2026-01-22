import React from "react";
import {
  User,
  Mail,
  BookOpen,
  Hash,
  Calendar,
} from "lucide-react";

const ProfileDashboard = () => {
  const Student = localStorage.getItem("Student");
  const Faculty = localStorage.getItem("Faculty");

  let formData = {};
  if (Student) {
    formData = JSON.parse(Student);
  }
  if (Faculty) {
    formData = JSON.parse(Faculty);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* FLOATING EMOJIS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-32 left-10 text-5xl animate-float">📚</div>
        <div className="absolute top-52 right-20 text-6xl animate-float-delayed">🎓</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">📖</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">✏️</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">🌟</div>
        <div className="absolute top-1/3 left-1/4 text-4xl animate-spin-slow">⚡</div>
        <div className="absolute bottom-1/3 right-1/4 text-4xl animate-pulse">💡</div>
      </div>

      {/* GRADIENT ORBS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-delayed" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-delayed-2" />

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-blue-300">
            Profile details are read only
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 via-blue-700/20 to-blue-800/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {formData.Url ? (
                  <img
                    src={formData.Url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-blue-400" />
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-4">
              {formData.FullName || formData.TeacherName}
            </h2>

            <p className="text-blue-300 text-sm">
              {Student ? "Student Profile" : "Faculty Profile"}
            </p>
          </div>

          {/* STUDENT UI */}
          {Student && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField icon={User} label="Full Name" value={formData.FullName} />
              <InfoField icon={Mail} label="Email Address" value={formData.email} />
              <InfoField icon={BookOpen} label="Department" value={formData.Department} />
              <InfoField icon={Hash} label="College Roll No" value={formData.CollegeRollNo} />
              <InfoField icon={Calendar} label="Graduation Year" value={formData.Semester} />
            </div>
          )}

          {/* FACULTY UI */}
          {Faculty && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField icon={User} label="Teacher Name" value={formData.TeacherName} />
              <InfoField icon={Mail} label="Email Address" value={formData.email} />
              <InfoField icon={BookOpen} label="Department" value={formData.Department} />
              <InfoField icon={Hash} label="Faculty ID" value={formData.FacultyId} />
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-500/10 rounded-xl border border-blue-400/20">
            <p className="text-sm text-blue-200 text-center">
              If any detail is incorrect, please contact the college admin
            </p>
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite 1s;
        }
        .animate-float-delayed-2 {
          animation: float 4s ease-in-out infinite 2s;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-blue-300 text-sm font-medium">
      <Icon className="w-4 h-4" />
      {label}
    </label>
    <input
      type="text"
      value={value || ""}
      disabled
      className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/10 text-white cursor-not-allowed opacity-70"
    />
  </div>
);

export default ProfileDashboard;
