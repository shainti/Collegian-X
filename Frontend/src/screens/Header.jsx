import { Link } from "react-router-dom";
import { useState } from "react";
import { Home, Sparkles, Info, LogIn } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-blue-950/30 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <h1 className="text-white text-3xl font-bold">Collegian</h1>
          <img src="/x3_logo.png" alt="Logo" className="h-13 w-13" />
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {/* HOME */}
          <Link
            to="/Home"
            className=" text-lg group relative flex items-center gap-2 text-white/70 hover:text-white transition duration-300"
          >
            <Home
              size={18}
              className="transition group-hover:translate-x-1 group-hover:text-cyan-300"
            />
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* FEATURES */}
          <Link
            to="/features"
            className=" text-lg group relative flex items-center gap-2 text-white/70 hover:text-white transition duration-300"
          >
            <Sparkles
              size={18}
              className="transition group-hover:translate-x-1 group-hover:text-cyan-300"
            />
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* ABOUT */}
          <Link
            to="/about"
            className=" text-lg group relative flex items-center gap-2 text-white/70 hover:text-white transition duration-300"
          >
            <Info
              size={18}
              className="transition group-hover:translate-x-1 group-hover:text-cyan-300"
            />
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* LOGIN (solid color button) */}
          <Link
            to="/Sign_in"
            className=" text-base group flex items-center gap-2 bg-[linear-gradient(to_right,#3b82f6,#14b8a6)]  text-white px-6 py-2 rounded-lg shadow transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <LogIn size={18} className=" transition group-hover:translate-x-1" />
            Log In
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`absolute h-px w-7 bg-white transition ${
              open ? "rotate-45" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute h-px w-7 bg-white transition ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-px w-7 bg-white transition ${
              open ? "-rotate-45" : "translate-y-2"
            }`}
          />
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-blue-950/40 backdrop-blur border-t border-white/10 py-6 flex flex-col items-center gap-6 text-lg">
          <Link
            to="/Home"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 text-white transition hover:translate-x-2"
          >
            <Home size={20} className="group-hover:text-cyan-300 transition" />
            Home
          </Link>

          <Link
            to="/features"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 text-white transition hover:translate-x-2"
          >
            <Sparkles
              size={20}
              className="group-hover:text-cyan-300 transition"
            />
            Features
          </Link>

          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 text-white transition hover:translate-x-2"
          >
            <Info size={20} className="group-hover:text-cyan-300 transition" />
            About
          </Link>
          
          <Link
            to="/Sign_in"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 bg-[linear-gradient(to_right,#3b82f6,#14b8a6)]  text-white px-6 py-2 rounded-lg shadow transition duration-300 hover:-translate-y-1"
          >
            <LogIn size={20} className="transition group-hover:translate-x-1" />
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
}
