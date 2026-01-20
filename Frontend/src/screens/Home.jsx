import HeroIcons from "../Icons/Heroicon";
import Footer from "./Footer";

export default function Home() {
  const token = localStorage.getItem("token");
  const student = localStorage.getItem('Student');
  // const faculty = localStorage.getItem('Faculty');
  
  return (
    <div className="relative w-full min-h-screen bg-[#050B16] flex pt-24 md:pt-34 justify-center overflow-hidden px-4">
      {/* Background Blue Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-blue-600/30 blur-[180px] rounded-full"></div>
      </div>
      
      {/* MAIN CONTENT */}
      <div className="relative z-10 text-white w-full max-w-4xl text-center">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight break-normal hyphens-auto px-2">
          Your{" "}
          <span className="text-cyan-300 drop-shadow-[0_0_5px_rgba(45,212,191,0.8)] font-light">
            Smart
          </span>{" "}
          College Companion
        </h2>
        
        <p className="text-white/60 max-w-sm sm:max-w-lg md:max-w-2xl mx-auto mt-4 text-lg sm:text-xl px-3 leading-relaxed">
          One dashboard for all your timetables, assignments, notices, books,
          chats, and reminders{" "}
          <span className="text-white slide-left-text">
            designed to reduce confusion and save your time.
          </span>
        </p>
        
        <div className="mt-6 md:mt-10">
          <HeroIcons />
        </div>
        
        {/* Explore Features Button - Shows when token exists */}
        {token && (
          <div className="flex justify-center mt-6 md:mt-8">
            <a
              href={student ? "/StudentDashboard" : "/FacultyDashboard"}
              className="bg-[linear-gradient(to_right,#3b82f6,#14b8a6)] text-white text-base sm:text-lg px-6 py-3 rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
            >
              Explore Features
            </a>
          </div>
        )}
        
        <Footer />
      </div>
    </div>
  );
}