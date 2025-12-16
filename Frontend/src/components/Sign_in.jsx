import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle2, School } from "lucide-react";

/* ================= ANIMATION VARIANTS ================= */

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.92,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 18,
      mass: 0.8,
      staggerChildren: 0.12,
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    scale: 0.95,
    filter: "blur(10px)",
    transition: { duration: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140 },
  },
};

/* ================= COMPONENT ================= */

const DualLogin = () => {
  const [mode, setMode] = useState("student"); // student | faculty

  return (
    <div className="relative w-full min-h-screen bg-[#050B16] flex items-center justify-center overflow-hidden">

      {/* BLUE GLOW BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] bg-blue-600/30 blur-[200px] rounded-full" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-[380px] md:w-[420px]">

        {/* TOGGLE */}
        <div className="flex mt-6 mb-3 bg-[#0a1122]/70 rounded-xl p-1 border border-blue-400/30">
          <button
            onClick={() => setMode("student")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all
              ${
                mode === "student"
                  ? "bg-[linear-gradient(to_right,#3b82f6,#14b8a6)] text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
          >
            Student
          </button>

          <button
            onClick={() => setMode("faculty")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all
              ${
                mode === "faculty"
                  ? "bg-[linear-gradient(to_right,#3b82f6,#14b8a6)] text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
          >
            Faculty
          </button>
        </div>

        {/* FORMS */}
        <AnimatePresence mode="wait">

          {/* STUDENT LOGIN */}
          {mode === "student" && (
            <motion.div
              key="student"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                bg-[#0a1122]/60 backdrop-blur-xl
                border border-blue-400/30
                rounded-2xl p-8 text-white
                shadow-[0_0_45px_rgba(56,189,248,0.2)]
              "
            >
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <UserCircle2 size={62} className="text-cyan-300 mb-4" />
                <h2 className="text-2xl font-bold text-cyan-200 mb-6">
                  Student Login
                </h2>
              </motion.div>

              <motion.input
                variants={itemVariants}
                type="text"
                placeholder="Enrollment Number"
                className="w-full p-3 mb-4 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white outline-none focus:border-cyan-400"
              />

              <motion.input
                variants={itemVariants}
                type="password"
                placeholder="Password"
                className="w-full p-3 mb-6 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white outline-none focus:border-cyan-400"
              />

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  w-full py-3 rounded-lg
                  bg-[linear-gradient(to_right,#3b82f6,#14b8a6)]
                  text-white font-semibold shadow-lg
                "
              >
                Login as Student
              </motion.button>
            </motion.div>
          )}

          {/* FACULTY LOGIN */}
          {mode === "faculty" && (
            <motion.div
              key="faculty"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                bg-[#0a1122]/60 backdrop-blur-xl
                border border-blue-400/30
                rounded-2xl p-8 text-white
                shadow-[0_0_45px_rgba(56,189,248,0.2)]
              "
            >
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <School size={62} className="text-cyan-300 mb-4" />
                <h2 className="text-2xl font-bold text-cyan-200 mb-6">
                  Faculty Login
                </h2>
              </motion.div>

              <motion.input
                variants={itemVariants}
                type="text"
                placeholder="Faculty ID"
                className="w-full p-3 mb-4 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white outline-none focus:border-cyan-400"
              />

              <motion.input
                variants={itemVariants}
                type="password"
                placeholder="Password"
                className="w-full p-3 mb-6 rounded-lg bg-[#050B16]/60 border border-blue-400/40 text-white outline-none focus:border-cyan-400"
              />

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  w-full py-3 rounded-lg
                  bg-[linear-gradient(to_right,#3b82f6,#14b8a6)]
                  text-white font-semibold shadow-lg
                "
              >
                Login as Faculty
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default DualLogin;
