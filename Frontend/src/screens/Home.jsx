import HeroIcons from "../Icons/Heroicon";
import Footer from "./Footer";
import FloatingAIButton from "../components/StudentComponents/FloatingAIButton";

export default function Home() {
  const token = localStorage.getItem("token");
  const student = localStorage.getItem("Student");

  return (
    <div className="relative w-full min-h-screen bg-[#050B16] flex pt-24 md:pt-34 justify-center overflow-hidden px-4">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-blue-600/30 blur-[180px] rounded-full"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 text-white w-full max-w-4xl text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight px-2">
          Your{" "}
          <span className="text-cyan-300 font-light">
            Smart
          </span>{" "}
          College Companion
        </h2>

        <p className="text-white/60 max-w-xl mx-auto mt-4 text-lg px-3 leading-relaxed">
          One dashboard for all your timetables, assignments, notices, books,
          chats, and reminders designed to reduce confusion and save your time.
        </p>

        <div className="mt-6 md:mt-10">
          <HeroIcons />
        </div>

        {/* CTA BUTTON */}
        <div className="flex justify-center mt-6 md:mt-8">
          {token ? (
            <a
              href={student ? "/StudentDashboard" : "/FacultyDashboard"}
              className="bg-[linear-gradient(to_right,#3b82f6,#14b8a6)] text-white text-base sm:text-lg px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition"
            >
              Explore Features
            </a>
          ) : (
            <a
              href="/Student/login"
              className="bg-[linear-gradient(to_right,#6366f1,#22d3ee)] text-white text-base sm:text-lg px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition"
            >
              Login to View Features
            </a>
          )}
        </div>

        <Footer />
      </div>

      {/* Floating AI Button - Only show when student is logged in */}
      {student && <FloatingAIButton />}
    </div>
  );
}