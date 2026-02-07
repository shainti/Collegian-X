import React, { useState } from "react";

const FloatingAIButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
      {/* Floating Button */}
      <button
        onClick={() => (window.location.href = "/Student/AIStudyPlanner")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 text-white rounded-full p-3 sm:p-3.5 md:p-4 shadow-xl sm:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 md:hover:scale-110 animate-float-gentle border border-cyan-400/30 active:scale-95"
      >
        {/* Glow effect */}
        <div
          className={`absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-full blur-lg sm:blur-xl transition-opacity duration-300 ${
            isHovered ? "opacity-75" : "opacity-50"
          }`}
        />

        {/* Icon Container */}
        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <img
              src="/icons/ai-brain.png"
              alt="AI Study Planner"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 object-contain animate-pulse-slow"
            />
          </div>

          {/* Expanding Text - Hidden on mobile, visible on desktop hover */}
          <span
            className={`hidden md:block font-bold text-base whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isHovered ? "max-w-[200px] opacity-100 pr-3" : "max-w-0 opacity-0"
            }`}
          >
            AI Study Planner
          </span>
        </div>

        {/* Sparkle particles - Smaller on mobile */}
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cyan-300 rounded-full animate-sparkle shadow-sm sm:shadow-lg shadow-cyan-400/50" />
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-300 rounded-full animate-sparkle-delayed shadow-sm sm:shadow-lg shadow-blue-400/50" />
          <div className="absolute top-1/2 left-1 sm:left-2 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-teal-300 rounded-full animate-sparkle-delayed-2 shadow-sm sm:shadow-lg shadow-teal-400/50" />
        </div>

        {/* Rotating ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-300/40 animate-spin-slow" />
      </button>

      {/* Tooltip - Hidden on mobile, visible on desktop */}
      {!isHovered && (
        <div className="hidden md:block absolute bottom-full right-0 mb-3 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-2xl border border-cyan-500/30 whitespace-nowrap animate-bounce-subtle">
          <span className="flex items-center gap-2">
            <span className="text-cyan-300">✨</span>
            Try AI Study Planner!
          </span>
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-900/95" />
        </div>
      )}

      {/* Mobile label - Only visible on small screens when not hovered */}
      <div className="md:hidden absolute -top-10 right-0 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg border border-cyan-500/30 whitespace-nowrap pointer-events-none opacity-0 group-active:opacity-100 transition-opacity duration-200">
        <span className="text-cyan-300">AI Study</span>
      </div>

      <style jsx>{`
        @keyframes float-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @media (min-width: 768px) {
          @keyframes float-gentle {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-12px);
            }
          }
        }
        
        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
        .animate-sparkle-delayed {
          animation: sparkle 1.5s ease-in-out infinite 0.5s;
        }
        .animate-sparkle-delayed-2 {
          animation: sparkle 1.5s ease-in-out infinite 1s;
        }

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingAIButton;