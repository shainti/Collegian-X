import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

const LoginSuccess = () => {

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/StudentDashboard";
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = () => {
    window.location.href = "/StudentDashboard";
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050B16] flex items-center justify-center overflow-hidden p-4">
      
      {/* ANIMATED BLUE GLOW BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] bg-blue-600/30 blur-[200px] rounded-full animate-pulse" />
      </div>

      {/* SUCCESS CARD */}
      <div className="relative z-10 w-full max-w-[480px] px-4 sm:px-0">
        <div className="bg-[#0a1122]/60 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6 sm:p-8 md:p-12 text-white shadow-[0_0_45px_rgba(56,189,248,0.2)]">
          
          {/* SUCCESS ICON */}
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
              <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full p-3 sm:p-4 shadow-lg">
                <CheckCircle2 size={48} className="text-white sm:w-16 sm:h-16" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-cyan-200">
              Login Successful!
            </h1>
            
            <p className="text-white/70 text-sm sm:text-base px-2">
              Welcome back! You have successfully logged in.
            </p>

            {/* REDIRECT MESSAGE */}
            <div className="pt-4 sm:pt-6">
              <p className="text-white/50 text-xs sm:text-sm">
                Redirecting to home page...
              </p>
            </div>

            {/* MANUAL REDIRECT BUTTON */}
            <div className="pt-3 sm:pt-4">
              <button
                onClick={handleRedirect}
                className="text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm font-medium transition-colors duration-200 underline underline-offset-4"
              >
                Go to Home Now
              </button>
            </div>
          </div>

          {/* DECORATIVE ELEMENTS */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default LoginSuccess;