import React, { useState } from "react";
import { UserCircle2, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    rollNo: "",
    password: "",
    department: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    await axios.post("http://localhost:3000/api/auth/Student/login", {
      email: formData.email,
      CollegeRollNo: formData.rollNo,
      password: formData.password,
      department: formData.department,
    }, {
      withCredentials: true
    });
    console.log("Student login:", formData);
    Navigate("/Student/login/Success");
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050B16] flex items-center justify-center overflow-hidden p-4">
      {/* BLUE GLOW BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-[700px] h-[700px] bg-blue-600/30 blur-[200px] rounded-full" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-[380px] my-auto">
        <div className="bg-[#0a1122]/60 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-5 sm:p-6 text-white shadow-[0_0_45px_rgba(56,189,248,0.2)] overflow-hidden">
          <div className="flex flex-col items-center mb-4">
            <UserCircle2 size={40} className="text-cyan-300 mb-2" />
            <h2 className="text-lg sm:text-xl font-bold text-cyan-200">Student Login</h2>
          </div>

          <div className="space-y-2.5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
            />

            <input
              type="text"
              name="rollNo"
              placeholder="College Roll No"
              value={formData.rollNo}
              onChange={handleChange}
              className="w-full p-2.5 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
            />

            <div className="relative">
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full p-2.5 pr-10 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 outline-none focus:border-cyan-400 transition-colors duration-200 appearance-none cursor-pointer ${
                  formData.department ? 'text-white' : 'text-white/40'
                }`}
              >
                <option value="" className="bg-[#050B16] text-white/40">Select Department</option>
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
                size={18} 
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-cyan-400/70 pointer-events-none" 
              />
            </div>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2.5 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
            />

            <button
              onClick={handleSubmit}
              className="w-full py-2.5 mt-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200"
            >
              Login as Student
            </button>
          </div>

          {/* Bottom Links */}
          <div className="mt-4 space-y-2">
            <div className="text-center">
              <Link
                to="/Student/register"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-200"
              >
                New Student? Register Here
              </Link>
            </div>

            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-blue-400/20"></div>
              <span className="px-3 text-xs text-white/40">OR</span>
              <div className="flex-1 h-px bg-blue-400/20"></div>
            </div>

            <div className="text-center">
              <Link
                to="/Faculty/login"
                className="text-white/60 hover:text-cyan-400 text-xs sm:text-sm font-medium transition-colors duration-200"
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

export default StudentLogin;
