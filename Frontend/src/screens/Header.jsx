import { Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, Sparkles, LogIn, UserCheck, User, LogOut } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const student = JSON.parse(localStorage.getItem("Student") || "null");

  const token = localStorage.getItem("token");
  const [IsloggedIn, setIsloggedIn] = useState(!!token);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Student");
    localStorage.removeItem("Faculty");
    setIsloggedIn(false);
    setProfileOpen(false);
    setOpen(false);
  };

  // close profile dropdown on outside click (desktop)
  useEffect(() => {
    const close = () => setProfileOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-blue-950/30 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <h1 className="text-white text-xl sm:text-3xl font-bold">
            Collegian <span className="text-cyan-400">X</span>
          </h1>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/Home"
            className="text-lg group relative flex items-center gap-2 text-white/70 hover:text-white transition"
          >
            <Home size={18} />
            Home
          </Link>

          <Link
            to={
              token
                ? student
                  ? "/StudentDashboard"
                  : "/FacultyDashboard"
                : "#"
            }
            onClick={(e) => {
              if (!token) e.preventDefault();
            }}
            className="text-lg group relative flex items-center gap-2 text-white/70 hover:text-white transition"
          >
            <Sparkles size={18} />
            Features
          </Link>

          {!IsloggedIn ? (
            <>
              <Link
                to="/Student/login"
                className="text-base group flex items-center gap-2 bg-[linear-gradient(to_right,#3b82f6,#14b8a6)] text-white px-6 py-2 rounded-lg shadow hover:-translate-y-1 transition"
              >
                <LogIn size={18} />
                Student
              </Link>

              <Link
                to="/Faculty/login"
                className="text-base group flex items-center gap-2 bg-[linear-gradient(to_right,#6366f1,#22d3ee)] text-white px-6 py-2 rounded-lg shadow hover:-translate-y-1 transition"
              >
                <UserCheck size={18} />
                Faculty
              </Link>
            </>
          ) : (
            /* PROFILE DROPDOWN DESKTOP */
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen(!profileOpen);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg hover:scale-110 transition overflow-hidden"
              >
                {student?.Url ? (
                  <img
                    src={student.Url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-44 rounded-xl bg-blue-950 border border-white/10 shadow-xl overflow-hidden">
                  <Link
                    to="/MyProfile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10"
                  >
                    <User size={16} />
                    My Profile
                  </Link>

                  <Link
                    to="/"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-white/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden relative w-8 h-8 sm:w-10 sm:h-10 flex flex-col justify-center items-center"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`absolute h-px w-6 bg-white transition ${
              open ? "rotate-45" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute h-px w-6 bg-white transition ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-px w-6 bg-white transition ${
              open ? "-rotate-45" : "translate-y-2"
            }`}
          />
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-blue-950/40 backdrop-blur border-t border-white/10 py-5 pb-6 flex flex-col items-center gap-4 text-base">
          <Link
            to="/Home"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-2.5 text-white transition hover:translate-x-2"
          >
            <Home size={18} />
            Home
          </Link>

          <Link
            to={
              token
                ? student
                  ? "/StudentDashboard"
                  : "/FacultyDashboard"
                : "#"
            }
            onClick={(e) => {
              if (!token) e.preventDefault();
            }}
            className="group flex items-center gap-2.5 text-white transition hover:translate-x-2"
          >
            <Sparkles size={18} />
            Features
          </Link>

          {!IsloggedIn ? (
            <>
              <Link
                to="/Student/login"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-2.5 bg-[linear-gradient(to_right,#3b82f6,#14b8a6)] text-white px-5 py-2 rounded-lg shadow hover:-translate-y-1 transition"
              >
                <LogIn size={18} />
                Student Login
              </Link>

              <Link
                to="/Faculty/login"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-2.5 bg-[linear-gradient(to_right,#6366f1,#22d3ee)] text-white px-5 py-2 rounded-lg shadow hover:-translate-y-1 transition"
              >
                <UserCheck size={18} />
                Faculty Login
              </Link>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3.5 mb-2">
              {/* Profile Image for Mobile */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg overflow-hidden">
                {student?.Url ? (
                  <img
                    src={student.Url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>

              <Link
                to="/MyProfile"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-2.5 text-white"
              >
                <User size={18} />
                My Profile
              </Link>

              <Link
                to="/"
                onClick={handleLogout}
                className="group flex items-center gap-2.5 bg-[linear-gradient(to_right,#6366f1,#22d3ee)] text-white px-5 py-2 rounded-lg shadow hover:-translate-y-1 transition"
              >
                <LogOut size={18} />
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}