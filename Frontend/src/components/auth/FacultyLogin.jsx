import React, { useState } from "react";
import { School } from "lucide-react";
import { Link } from "react-router-dom";

const FacultyLogin = () => {
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

  const handleSubmit = () => {
    console.log("Faculty login:", formData);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050B16] flex items-center justify-center overflow-hidden p-4">
      
      {/* BLUE GLOW BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] bg-blue-600/30 blur-[200px] rounded-full" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-[420px]">
        
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
              className="w-full p-3 mb-3 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mb-5 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
            />

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200"
            >
              Login as Faculty
            </button>
          </div>

          {/* Bottom Links */}
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-blue-400/20"></div>
              <span className="px-3 text-xs text-white/40">OR</span>
              <div className="flex-1 h-px bg-blue-400/20"></div>
            </div>

            <div className="text-center">
              <Link to="/Student/login" className="text-white/60 hover:text-cyan-400 text-sm font-medium transition-colors duration-200">
                ← Student Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;