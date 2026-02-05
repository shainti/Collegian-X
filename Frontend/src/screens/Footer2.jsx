import { Github, Linkedin, Mail, Heart } from "lucide-react";

const token = localStorage.getItem("token");
export default function Footer() {
  return (
    <footer
      className="relative w-full overflow-hidden bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900"
    >
      {/* Background effects matching attendance page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      {/* Footer container - adjusted width to match page */}
      <div className="relative z-10 max-w-9xl">
        <div className="bg-gradient-to-br from-slate-100/1 to-blue-900/10 backdrop-blur-xl border border-white/10  p-8 shadow-xl">
          {/* Top section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Collegian <span className="text-cyan-400">X</span>
              </h2>
              <p className="text-blue-200 mt-2 max-w-md text-sm">
                Your smart college companion for assignments, attendance,
                notices, timetables, and everything in one place.
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/shainti"
                className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.linkedin.com/in/shainti-kashyap-612089340"
                className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=shaintykashyap@gmail.com"
                className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-white/10" />

          {/* Bottom section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-blue-200">
            <p>
              © {new Date().getFullYear()} Collegian X. All rights reserved.
            </p>

            <p className="flex items-center gap-1">
              Owned by{" "}
              <span className="text-white font-semibold">Shainti Kashyap</span>
              <Heart className="w-4 h-4 text-red-400 ml-1 fill-red-400" />
            </p>
          </div>
        </div>
      </div>

      {/* Floating emojis */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <span className="absolute top-10 left-20 text-xl animate-float">
          📘
        </span>
        <span className="absolute bottom-10 right-24 text-xl animate-float-delayed">
          🎓
        </span>
        <span className="absolute top-1/2 right-10 text-lg animate-float-delayed-2">
          ✏️
        </span>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-25px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite 2s;
        }
        .animate-float-delayed-2 {
          animation: float 6s ease-in-out infinite 4s;
        }
      `}</style>
    </footer>
  );
}
