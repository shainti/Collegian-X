import React, { useState } from "react";
import { School, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const FacultyLogin = () => {
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    FacultyId: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    setLoading(true);
    setErrors("");
    try {
      const response = await fetch(
        "https://collegian-x-1.onrender.com/api/auth/Faculty/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            FacultyId: formData.FacultyId,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("Faculty", JSON.stringify(data.Faculty));

        // CRITICAL: Dispatch custom event to notify Header component
        window.dispatchEvent(new Event("authChange"));

        console.log("Faculty login:", formData);

        // Simulate navigation (replace with your actual router)
        window.location.href = "/FacultyDashboard";
      } else {
        setErrors(data.errors);
        setLoading(false);
      }
    } catch (error) {
      setErrors("Login failed. Please try again.");
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center overflow-hidden p-4">
      {/* Floating background emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 text-5xl animate-float">📚</div>
        <div className="absolute top-40 right-20 text-6xl animate-float-delayed">
          🎓
        </div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">
          📖
        </div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">
          ✏️
        </div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">
          🌟
        </div>
        <div className="absolute top-1/3 left-1/4 text-4xl animate-spin-slow">
          ⚡
        </div>
        <div className="absolute bottom-1/3 right-1/4 text-4xl animate-pulse">
          💡
        </div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-delayed" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-delayed-2" />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-[420px]">
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
        <div className="bg-[#0a1122]/60 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-8 text-white shadow-[0_0_45px_rgba(56,189,248,0.2)]">
          <div className="flex flex-col items-center mb-6">
            <School size={56} className="text-cyan-300 mb-3" />
            <h2 className="text-2xl font-bold text-cyan-200">Faculty Login</h2>
          </div>

          <div>
            <input
              type="text"
              name="FacultyId"
              placeholder="Faculty ID"
              value={formData.FacultyId}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 mb-3 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 mb-5 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white placeholder-white/40 outline-none focus:border-cyan-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                "Login as Faculty"
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
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
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default FacultyLogin;