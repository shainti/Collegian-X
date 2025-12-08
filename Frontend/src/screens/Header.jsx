import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="
      fixed top-0 left-0 w-full z-50
      bg-[rgba(30,40,79,0.18)]
      backdrop-blur-lg
      border-b border-white/10
    "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <h1 className="text-white text-3xl font-bold">Collegian</h1>
          <img src="/x3_logo.png" alt="Logo" className="h-13 w-13" />
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/Home" className="text-white/70 hover:text-white">
            Home
          </Link>
          <Link to="features" className="text-white/70 hover:text-white">
            Features
          </Link>
          <Link to="about" className="text-white/70 hover:text-white">
            About
          </Link>
          <Link
            to="/Sign_in"
            className="
  bg-[linear-gradient(to_right,#3b82f6,#14b8a6)]
  text-white px-6 py-2
  rounded-lg shadow-lg
  hover:shadow-blue-500/40
  transition duration-300
"
          >
            Log In
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center"
          onClick={() => setOpen(!open)}
        >
          {/* TOP LINE */}
          <span
            className={`absolute h-px w-7 bg-white transition-all duration-300
  ${open ? "rotate-45" : "-translate-y-2"}`}
          />

          {/* MIDDLE LINE */}
          <span
            className={`absolute h-px w-7 bg-white transition-all duration-300
  ${open ? "opacity-0" : "opacity-100"}`}
          />

          {/* BOTTOM LINE */}
          <span
            className={`absolute h-px w-7 bg-white transition-all duration-300
  ${open ? "-rotate-45" : "translate-y-2"}`}
          />
        </button>
      </div>

      {/* MOBILE MENU PANEL */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out
        ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-[rgba(30,40,79,0.18)] backdrop-blur-xl border-t border-white/10 py-6 flex flex-col items-center gap-6 text-lg">
          <Link
            to="/Home"
            onClick={() => setOpen(false)}
            className="text-white"
          >
            Home
          </Link>

          <Link
            to="/features"
            onClick={() => setOpen(false)}
            className="text-white"
          >
            Features
          </Link>

          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="text-white"
          >
            About
          </Link>

          <Link
            to="/Sign_in"
            onClick={() => setOpen(false)}
            className="
    bg-[linear-gradient(to_right,#3b82f6,#14b8a6)]
    text-white px-6 py-2 rounded-lg shadow-lg
    hover:shadow-blue-500/40 transition
  "
          >
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
}
