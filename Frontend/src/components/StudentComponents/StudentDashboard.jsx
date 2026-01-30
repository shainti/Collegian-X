import React, { useState } from "react";

const PortalCard = ({
  image,
  title,
  buttonText,
  bgColor,
  iconColor,
  onClick,
  index,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleTouchStart = () => {
    setIsActive(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsActive(false), 300);
  };

  return (
    <div
      className={`group relative ${bgColor} rounded-3xl p-5 flex flex-col items-center justify-between min-h-[240px] cursor-pointer border border-white/10 transition-all duration-500 ease-out ${
        isActive ? 'scale-105 -translate-y-2 border-white/20' : 'hover:scale-105 hover:-translate-y-2 hover:border-white/20'
      }`}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
      }}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl transition-opacity duration-500 ${
        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`} />

      {/* Animated glow */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${bgColor} rounded-3xl blur-xl transition-opacity duration-500 ${
          isActive ? 'opacity-30' : 'opacity-0 group-hover:opacity-30'
        }`}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* PNG ICON */}
        <div
          className={`relative mb-4 ${iconColor} w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
            isActive ? 'shadow-xl scale-110 -translate-y-1' : 'group-hover:shadow-xl group-hover:scale-110 group-hover:-translate-y-1'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
          <img
            src={image}
            alt={title}
            className="w-10 h-10 object-contain relative z-10"
          />
        </div>

        <h3 className={`text-white text-lg font-bold mb-6 text-center transition-transform duration-300 ${
          isActive ? 'scale-105' : 'group-hover:scale-105'
        }`}>
          {title}
        </h3>

        <button className={`mt-auto bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2 border border-white/20 transition-all duration-300 shadow-lg ${
          isActive ? 'bg-white/20 border-white/40 scale-110 shadow-xl' : 'hover:bg-white/20 hover:border-white/40 group-hover:scale-110 hover:shadow-xl'
        }`}>
          <span>{buttonText}</span>
          <span className={`transition-transform duration-300 ${
            isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
          }`}>
            →
          </span>
        </button>
      </div>
    </div>
  );
};

export default function StudentPortal() {
  const cards = [
    {
      id: 1,
      image: "/icons/pencil.png",
      title: "Assignments",
      buttonText: "View All",
      bgColor:
        "bg-gradient-to-br from-blue-600/20 via-blue-700/20 to-blue-800/20",
      iconColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      onClick: () => (window.location.href = "/Student/Assignments"),

    },
    {
      id: 2,
      image: "/icons/time.png",
      title: "Timetable",
      buttonText: "View All",
      bgColor:
        "bg-gradient-to-br from-cyan-600/20 via-cyan-700/20 to-cyan-800/20",
      iconColor: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      onClick: () => (window.location.href = "/Student/Timetable"),
    },
    {
      id: 3,
      image: "/icons/book.png",
      title: "Library Books",
      buttonText: "View All",
      bgColor:
        "bg-gradient-to-br from-teal-600/20 via-teal-700/20 to-teal-800/20",
      iconColor: "bg-gradient-to-br from-teal-500 to-teal-600",
      onClick: () => console.log("Library Books clicked"),
    },
    {
      id: 4,
      image: "/icons/attendance.png",
      title: "Attendance",
      buttonText: "View All",
      bgColor:
        "bg-gradient-to-br from-emerald-600/20 via-emerald-700/20 to-emerald-800/20",
      iconColor: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      onClick: () => (window.location.href = "/Student/Attendance"),
    },
    {
      id: 5,
      image: "/icons/leave.png",
      title: "Leaves",
      buttonText: "View All",
      bgColor:
        "bg-gradient-to-br from-yellow-600/20 via-blue-700/20 to-blue-800/20",
      iconColor: "bg-gradient-to-br from-blue-500 to-yellow-600",
      onClick: () => console.log("VIew Assignments clicked"),
    },
    {
      id: 6,
      image: "/icons/notice.png",
      title: "Notices",
      buttonText: "View All",
      bgColor:
        "bg-gradient-to-br from-indigo-600/20 via-indigo-700/20 to-indigo-800/20",
      iconColor: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      onClick: () => console.log("Notices clicked"),
    },
    {
      id: 7,
      image: "/icons/message.png",
      title: "Complaints",
      buttonText: "View All",
      bgColor:
        "bg-gradient-to-br from-purple-600/20 via-purple-700/20 to-purple-800/20",
      iconColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      onClick: () => console.log("Complaints clicked"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* FLOATING EMOJIS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-32 left-10 text-5xl animate-float">📚</div>
        <div className="absolute top-52 right-20 text-6xl animate-float-delayed">🎓</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">📖</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">✏️</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">🌟</div>
        <div className="absolute top-1/3 left-1/4 text-4xl animate-spin-slow">⚡</div>
        <div className="absolute bottom-1/3 right-1/4 text-4xl animate-pulse">💡</div>
      </div>

      {/* GRADIENT ORBS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-delayed" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-delayed-2" />

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <PortalCard key={card.id} {...card} index={index} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite 1s;
        }
        .animate-float-delayed-2 {
          animation: float 4s ease-in-out infinite 2s;
        }
        .animate-pulse-delayed {
          animation: pulse 3s infinite 1s;
        }
        .animate-pulse-delayed-2 {
          animation: pulse 3s infinite 2s;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}