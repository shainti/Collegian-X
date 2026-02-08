import React, { useState } from "react";
import { UserPlus, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentRegister = () => {
  const Navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    setErrors("");

    try {
      await axios.post(
        "http://localhost:3000/api/auth/Student/register",
        {
          FullName: formData.FullName,
          email: formData.email,
          Department: formData.Department,
          Semester: formData.Semester,
          CollegeRollNo: formData.CollegeRollNo,
          password: formData.password,
        },
        {
          withCredentials: true,
        },
      );
      console.log("Student registration:", formData);
      
      // Store email in localStorage and pass via state
      localStorage.setItem('userEmail', formData.email);
      Navigate("/Student/Emailverify", { state: { email: formData.email } });
      
    } catch (data) {
      setErrors(data.response?.data?.errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050B16] flex items-center justify-center p-4">
      {/* BLUE GLOW BACKGROUND - Static */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* FLOATING ICONS - Removed all animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 text-4xl">📚</div>
        <div className="absolute top-32 right-20 text-5xl">🎓</div>
        <div className="absolute bottom-40 left-16 text-4xl">📖</div>
        <div className="absolute top-1/2 right-12 text-3xl">✏️</div>
        <div className="absolute bottom-24 right-1/3 text-4xl">🌟</div>
        <div className="absolute top-1/3 left-1/4 text-3xl">⚡</div>
        <div className="absolute bottom-1/3 right-1/4 text-3xl">💡</div>
        <div className="absolute top-1/4 right-1/3 text-4xl">📝</div>
        <div className="absolute bottom-1/2 left-1/3 text-3xl">🎯</div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-[550px]">
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
        <div className="bg-[#0a1122]/60 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6 text-white shadow-[0_0_45px_rgba(56,189,248,0.2)] w-full">
          <div className="flex flex-col items-center mb-4">
            <UserPlus size={40} className="text-cyan-300 mb-2" />
            <h2 className="text-xl font-bold text-cyan-200">
              Student Register
            </h2>
          </div>

          <div className="space-y-3">
            {/* Full Name */}
            <input
              type="text"
              name="FullName"
              placeholder="Full Name"
              value={formData.FullName}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full p-3 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Email and Roll No */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-3 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <input
                type="text"
                name="CollegeRollNo"
                placeholder="Roll No"
                value={formData.CollegeRollNo}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-3 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Department and Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <select
                  name="Department"
                  value={formData.Department}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full p-3 pr-8 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 outline-none focus:border-cyan-400 transition-colors duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.Department ? "text-white" : "text-white/40"
                  }`}
                >
                  <option value="" className="bg-[#050B16] text-white/40">
                    Department
                  </option>
                  <option value="BCA" className="bg-[#050B16] text-white/90">
                    BCA
                  </option>
                  <option value="MCA" className="bg-[#050B16] text-white/90">
                    MCA
                  </option>
                  <option value="BBA" className="bg-[#050B16] text-white/90">
                    BBA
                  </option>
                  <option value="BVOC" className="bg-[#050B16] text-white/90">
                    BVOC
                  </option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400/70 pointer-events-none"
                />
              </div>

              <div className="relative">
                <select
                  name="Semester"
                  value={formData.Semester}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full p-3 pr-8 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 outline-none focus:border-cyan-400 transition-colors duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.Semester ? "text-white" : "text-white/40"
                  }`}
                >
                  <option value="" className="bg-[#050B16] text-white/40">
                    Graduation Year
                  </option>
                  <option value="1" className="bg-[#050B16] text-white/90">
                    1st
                  </option>
                  <option value="2" className="bg-[#050B16] text-white/90">
                    2nd
                  </option>
                  <option value="3" className="bg-[#050B16] text-white/90">
                    3rd
                  </option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400/70 pointer-events-none"
                />
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-3 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-3 text-sm rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                "Register as Student"
              )}
            </button>
          </div>

          {/* Bottom Links */}
          <div className="mt-4 space-y-2">
            <div className="text-center">
              <Link
                to="/Student/login"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-200"
              >
                Already have an account? Login Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;