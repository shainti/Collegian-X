import React, { useState } from "react";
import { UserPlus, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentRegister = () => {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    FullName: "",
    email: "",
    CollegeRollNo: "",
    Department: "",
    Semester: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/auth/Student/register", {
        FullName: formData.FullName,
        email: formData.email,
        Department: formData.Department,
        Semester: formData.Semester,
        CollegeRollNo: formData.CollegeRollNo,
        password: formData.password,
      }, {
        withCredentials: true
      });
      console.log("Student registration:", formData);
      Navigate("/StudentDashboard");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050B16] flex items-center justify-center overflow-y-auto p-3 sm:p-4">
      {/* BLUE GLOW BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-[700px] h-[700px] bg-blue-600/30 blur-[200px] rounded-full" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative mt-8 z-10 w-full max-w-[500px] my-4 sm:my-auto">
        <div className="bg-[#0a1122]/60 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-4 sm:p-5 text-white shadow-[0_0_45px_rgba(56,189,248,0.2)] overflow-hidden">
          <div className="flex flex-col items-center mb-3">
            <UserPlus size={36} className="text-cyan-300 mb-1.5" />
            <h2 className="text-base sm:text-lg font-bold text-cyan-200">Student Register</h2>
          </div>

          <div className="space-y-2">
            {/* Full Name - Full Width */}
            <input
              type="text"
              name="FullName"
              placeholder="Full Name"
              value={formData.FullName}
              onChange={handleChange}
              className="w-full p-2 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
            />

            {/* Email and Roll No - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
              />
              <input
                type="text"
                name="CollegeRollNo"
                placeholder="Roll No"
                value={formData.CollegeRollNo}
                onChange={handleChange}
                className="w-full p-2 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
              />
            </div>

            {/* Department and Semester - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <select
                  name="Department"
                  value={formData.Department}
                  onChange={handleChange}
                  className={`w-full p-2 pr-8 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 outline-none focus:border-cyan-400 transition-colors duration-200 appearance-none cursor-pointer ${
                    formData.Department ? 'text-white' : 'text-white/40'
                  }`}
                >
                  <option value="" className="bg-[#050B16] text-white/40">Department</option>
                  <option value="BCA" className="bg-[#050B16] text-white/90">BCA</option>
                  <option value="MCA" className="bg-[#050B16] text-white/90">MCA</option>
                  <option value="BBA" className="bg-[#050B16] text-white/90">BBA</option>
                  <option value="BVOC" className="bg-[#050B16] text-white/90">BVOC</option>
                  <option value="BCOM" className="bg-[#050B16] text-white/90">BCOM</option>
                  <option value="MCOM" className="bg-[#050B16] text-white/90">MCOM</option>
                  <option value="BSC" className="bg-[#050B16] text-white/90">BSC</option>
                  <option value="MSC" className="bg-[#050B16] text-white/90">MSC</option>
                </select>
                <ChevronDown 
                  size={14} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400/70 pointer-events-none" 
                />
              </div>

              <div className="relative">
                <select
                  name="Semester"
                  value={formData.Semester}
                  onChange={handleChange}
                  className={`w-full p-2 pr-8 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 outline-none focus:border-cyan-400 transition-colors duration-200 appearance-none cursor-pointer ${
                    formData.Semester ? 'text-white' : 'text-white/40'
                  }`}
                >
                  <option value="" className="bg-[#050B16] text-white/40">Semester</option>
                  <option value="1" className="bg-[#050B16] text-white/90">1st</option>
                  <option value="2" className="bg-[#050B16] text-white/90">2nd</option>
                  <option value="3" className="bg-[#050B16] text-white/90">3rd</option>
                  <option value="4" className="bg-[#050B16] text-white/90">4th</option>
                  <option value="5" className="bg-[#050B16] text-white/90">5th</option>
                  <option value="6" className="bg-[#050B16] text-white/90">6th</option>
                  <option value="7" className="bg-[#050B16] text-white/90">7th</option>
                  <option value="8" className="bg-[#050B16] text-white/90">8th</option>
                </select>
                <ChevronDown 
                  size={14} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400/70 pointer-events-none" 
                />
              </div>
            </div>

            {/* Password and Confirm Password - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-2 mt-0.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200"
            >
              Register as Student
            </button>
          </div>

          {/* Bottom Links */}
          <div className="mt-3 space-y-1.5">
            <div className="text-center">
              <Link
                to="/Student/login"
                className="text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm font-medium transition-colors duration-200"
              >
                Already have an account? Login Here
              </Link>
            </div>

            <div className="flex items-center my-1.5">
              <div className="flex-1 h-px bg-blue-400/20"></div>
              <span className="px-2 text-xs text-white/40">OR</span>
              <div className="flex-1 h-px bg-blue-400/20"></div>
            </div>

            <div className="text-center">
              <Link
                to="/Faculty/login"
                className="text-white/60 hover:text-cyan-400 text-xs font-medium transition-colors duration-200"
              >
                Faculty Login →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;

