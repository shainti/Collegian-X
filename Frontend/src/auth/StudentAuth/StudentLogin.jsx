import React, { useState } from "react";
import { UserCircle2, ChevronDown } from "lucide-react";
import { data, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const StudentLogin = () => {
  const Navigate = useNavigate();
 const [errors, setErrors] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    CollegeRollNo: "",
    password: "",
    Department: "",
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
      CollegeRollNo: formData.CollegeRollNo,
      password: formData.password,
      Department: formData.Department,
    }, {
      withCredentials: true
    }).then(()=>{
      console.log("Student login:", formData);
      Navigate("/StudentDashboard");
    }).catch(data =>
       setErrors(data.response?.data?.errors))
  };

  return (
     
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center overflow-hidden p-4">
  
      {/* Floating background emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 text-5xl animate-float">📚</div>
        <div className="absolute top-40 right-20 text-6xl animate-float-delayed">🎓</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">📖</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">✏️</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">🌟</div>
        <div className="absolute top-1/3 left-1/4 text-4xl animate-spin-slow">⚡</div>
        <div className="absolute bottom-1/3 right-1/4 text-4xl animate-pulse">💡</div>
      </div>

      {/* Animated gradient orbs */}
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-delayed" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-delayed-2" />
     
      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-[380px] my-auto">
            {errors && (
  <div className="mb-4 rounded-xl border border-blue-400/40 bg-white-500/10 px-4 py-3 text-sm text-red-300 shadow-[0_0_25px_rgba(248,113,113,0.25)] backdrop-blur-md">
    <div className="flex items-center gap-2">
      <span className="text-lg">⚠️</span>
      <span className="font-medium">
        {Array.isArray(errors) ? errors[0] : errors}
      </span>
    </div>
  </div>
)}
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
              name="CollegeRollNo"
              placeholder="College Roll No"
              value={formData.CollegeRollNo}
              onChange={handleChange}
              className="w-full p-2.5 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200"
            />

            <div className="relative">
              <select
                name="Department"
                value={formData.Department}
                onChange={handleChange}
                className={`w-full p-2.5 pr-10 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 outline-none focus:border-cyan-400 transition-colors duration-200 appearance-none cursor-pointer ${
                  formData.Department ? 'text-white' : 'text-white/40'
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
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(8deg);
          }
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

        .animate-pulse-delayed {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s;
        }

        .animate-pulse-delayed-2 {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite 2s;
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

export default StudentLogin;