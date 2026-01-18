import React, { useState } from "react";

const FacultyCard = ({
  icon,
  title,
  buttonText,
  bgColor,
  iconColor,
  onClick,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative ${bgColor} rounded-3xl p-5 flex flex-col items-center justify-between min-h-[240px] cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-2`}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Animated glow */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${bgColor} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* IMAGE ICON */}
        <div
          className={`relative mb-4 ${iconColor} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
          <img
            src={icon}
            alt={title}
            className="w-8 h-8 object-contain relative z-10"
          />
        </div>

        <h3 className="text-white text-lg font-bold mb-6 text-center group-hover:scale-105 transition-transform duration-300">
          {title}
        </h3>

        <button className="mt-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2 border border-white/20 hover:border-white/40 transition-all duration-300 group-hover:scale-110 shadow-lg hover:shadow-xl">
          <span>{buttonText}</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </button>
      </div>
    </div>
  );
};

export default function FacultyDashboard() {
  const cards = [
    {
      id: 1,
      icon: "/icons/pencil.png",
      title: "Update Assignments",
      buttonText: "Update",
      bgColor:
        "bg-gradient-to-br from-blue-600/20 via-blue-700/20 to-blue-800/20",
      iconColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      onClick: () => console.log("Update Assignments clicked"),
    },
    {
      id: 2,
      icon: "/icons/time.png",
      title: "Update Timetable",
      buttonText: "Update",
      bgColor:
        "bg-gradient-to-br from-cyan-600/20 via-cyan-700/20 to-cyan-800/20",
      iconColor: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      onClick: () => console.log("Update Timetable clicked"),
    },
    {
      id: 3,
      icon: "/icons/attendance1.png",
      title: "Update Attendance",
      buttonText: "Update",
      bgColor:
        "bg-gradient-to-br from-emerald-600/20 via-emerald-700/20 to-emerald-800/20",
      iconColor: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      onClick: () => console.log("Update Attendance clicked"),
    },
    {
      id: 4,
      icon: "/icons/notice.png",
      title: "Update Notices",
      buttonText: "Update",
      bgColor:
        "bg-gradient-to-br from-teal-600/20 via-teal-700/20 to-teal-800/20",
      iconColor: "bg-gradient-to-br from-teal-500 to-teal-600",
      onClick: () => console.log("Update Notices clicked"),
    },
    {
      id: 5,
      icon: "/icons/message.png",
      title: "Check Complaints",
      buttonText: "Check",
      bgColor:
        "bg-gradient-to-br from-indigo-600/20 via-indigo-700/20 to-indigo-800/20",
      iconColor: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      onClick: () => console.log("Check Complaints clicked"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      <div className="max-w-5xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <FacultyCard key={card.id} {...card} index={index} />
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
      `}</style>
    </div>
  );
}
