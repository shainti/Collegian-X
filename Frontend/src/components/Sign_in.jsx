import React, { useState } from "react";
import { UserCircle2, School } from "lucide-react";

// Student Login Component
const StudentLogin = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    rollNo: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-[#0a1122]/60 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-8 text-white shadow-[0_0_45px_rgba(56,189,248,0.2)]">
      <div className="flex flex-col items-center mb-6">
        <UserCircle2 size={56} className="text-cyan-300 mb-3" />
        <h2 className="text-2xl font-bold text-cyan-200">
          Student Login
        </h2>
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
        />
        
        <input
          type="text"
          name="rollNo"
          placeholder="College Roll No"
          value={formData.rollNo}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 mb-5 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200"
        >
          Login as Student
        </button>
      </div>
    </div>
  );
};

// Faculty Login Component
const FacultyLogin = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    facultyId: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-[#0a1122]/60 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-8 text-white shadow-[0_0_45px_rgba(56,189,248,0.2)]">
      <div className="flex flex-col items-center mb-6">
        <School size={56} className="text-cyan-300 mb-3" />
        <h2 className="text-2xl font-bold text-cyan-200">
          Faculty Login
        </h2>
      </div>

      <div>
        <input
          type="text"
          name="facultyId"
          placeholder="Faculty ID"
          value={formData.facultyId}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 mb-5 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200"
        >
          Login as Faculty
        </button>
      </div>
    </div>
  );
};

// Main Component
const DualLogin = () => {
  const [mode, setMode] = useState("student");

  const handleStudentSubmit = (data) => {
    console.log("Student login:", data);
    // Add your student login logic here
    // Example: window.location.href = '/student-dashboard';
  };

  const handleFacultySubmit = (data) => {
    console.log("Faculty login:", data);
    // Add your faculty login logic here
    // Example: window.location.href = '/faculty-dashboard';
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050B16] flex items-center justify-center overflow-hidden p-4">
      
      {/* BLUE GLOW BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] bg-blue-600/30 blur-[200px] rounded-full" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-[420px]">
        
        {/* TOGGLE */}
        <div className="flex mt-6 mb-4 bg-[#0a1122]/70 backdrop-blur-xl rounded-xl p-1 border border-blue-400/30">
          <button
            onClick={() => setMode("student")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
              ${
                mode === "student"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
          >
            Student
          </button>

          <button
            onClick={() => setMode("faculty")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
              ${
                mode === "faculty"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
          >
            Faculty
          </button>
        </div>

        {/* FORMS CONTAINER */}
        <div className="relative min-h-[480px]">
          
          {/* STUDENT LOGIN */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${mode === "student" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <StudentLogin onSubmit={handleStudentSubmit} />
          </div>

          {/* FACULTY LOGIN */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${mode === "faculty" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <FacultyLogin onSubmit={handleFacultySubmit} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default DualLogin;