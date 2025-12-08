import React from "react";
import { motion } from "framer-motion";
import { UserCircle2, School } from "lucide-react";

const DualLogin = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#050B16] flex items-center justify-center overflow-hidden">

      {/* Blue Glow Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] bg-blue-600/30 blur-[200px] rounded-full"></div>
      </div>

      {/* CONTAINER */}
      <div className="relative z-10 w-[70%] max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* FACULTY LOGIN */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="
            bg-[#0a1122]/50 backdrop-blur-xl border border-blue-400/30
            rounded-2xl p-8 flex flex-col items-center text-white
            hover:border-blue-400/60 hover:shadow-[0_0_35px_rgba(56,189,248,0.3)]
            transition-all duration-300
          "
        >
          <School size={60} className="text-blue-300 mb-4" />
          <h2 className="text-2xl font-bold mb-6 text-blue-200">Faculty Login</h2>

          <input
            type="text"
            placeholder="Faculty ID"
            className="w-full p-3 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white mb-6"
          />

          <button className="
            w-40 py-3 rounded-lg bg-blue-600/70 text-white font-semibold
            hover:bg-blue-600/90 transition shadow-lg shadow-blue-500/20
          ">
            Login as Faculty
          </button>
        </motion.div>

        {/* STUDENT LOGIN */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="
            bg-[#0a1122]/50 backdrop-blur-xl border border-blue-400/30
            rounded-2xl p-8 flex flex-col items-center text-white
            hover:border-blue-400/60 hover:shadow-[0_0_35px_rgba(56,189,248,0.3)]
            transition-all duration-300
          "
        >
          <UserCircle2 size={60} className="text-blue-300 mb-4" />
          <h2 className="text-2xl font-bold mb-6 text-blue-200">Student Login</h2>

          <input
            type="text"
            placeholder="Enrollment No."
            className="w-full p-3 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white mb-6"
          />

          <button className="
            w-40 py-3 rounded-lg bg-blue-600/70 text-white font-semibold
            hover:bg-blue-600/90 transition shadow-lg shadow-blue-500/20
          ">
            Login as Student
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default DualLogin;
