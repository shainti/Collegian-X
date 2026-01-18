import React, { useState } from 'react';
import { FileEdit, Calendar, Bell, MessageSquare } from 'lucide-react';

const FacultyCard = ({ icon: Icon, title, subtitle, buttonText, bgColor, iconBgColor, shadowColor, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div 
      className={`${bgColor} rounded-[2rem] mt-14 p-8 flex flex-col items-center justify-between min-h-[320px] relative overflow-visible cursor-pointer animate-fade-in opacity-0 border-4 border-cyan-400/30`}
      style={{
        animationDelay: `${index * 150}ms`,
        animationFillMode: 'forwards',
        boxShadow: isPressed 
          ? `4px 4px 0px ${shadowColor}` 
          : isHovered 
            ? `12px 12px 0px ${shadowColor}` 
            : `8px 8px 0px ${shadowColor}`,
        transform: isPressed ? 'translate(4px, 4px)' : 'translate(0, 0)',
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
    >
      {/* Cartoon dots decoration */}
      <div className="absolute top-4 right-4 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-cyan-600"></div>
        <div className="w-3 h-3 rounded-full bg-blue-400 border-2 border-blue-600"></div>
        <div className="w-3 h-3 rounded-full bg-teal-400 border-2 border-teal-600"></div>
      </div>

      {/* Bouncing stars when hovered */}
      {isHovered && (
        <>
          <div className="absolute -top-4 left-1/4 text-3xl animate-bounce">⭐</div>
          <div className="absolute -top-6 right-1/4 text-2xl animate-bounce delay-200">✨</div>
        </>
      )}
      
      {/* Icon container with cartoon style */}
      <div className={`${iconBgColor} w-28 h-28 rounded-full flex items-center justify-center mb-6 relative z-10 border-4 border-cyan-500/50 transition-all duration-300 ${isHovered ? 'scale-110 animate-bounce' : 'scale-100'}`}
        style={{
          boxShadow: '6px 6px 0px rgba(6, 182, 212, 0.6)'
        }}
      >
        <Icon 
          className={`w-14 h-14 text-cyan-100 transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`} 
          strokeWidth={2.5} 
        />
      </div>
      
      {/* Title with professional style */}
      <div className={`text-center mb-6 relative z-10 transition-all duration-300 ${isHovered ? 'transform scale-105' : ''}`}>
        <h3 className="text-white text-xl font-semibold leading-tight tracking-normal">
          {title}
        </h3>
        {subtitle && (
          <p className="text-cyan-200 text-sm mt-2 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Professional Button */}
      <button
        className={`bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 relative z-10 transition-all duration-200 shadow-lg ${isHovered ? 'scale-105 shadow-xl shadow-cyan-500/50' : 'scale-100'}`}
      >
        <span>{buttonText}</span>
        <span className={`text-lg transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>›</span>
      </button>
      
      {/* Comic book action lines */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 left-4 w-12 h-1 bg-cyan-300 opacity-70 rotate-45"></div>
            <div className="absolute bottom-4 right-4 w-12 h-1 bg-cyan-300 opacity-70 -rotate-45"></div>
            <div className="absolute top-1/2 right-4 w-8 h-1 bg-cyan-300 opacity-70"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function FacultyDashboard() {
  const cards = [
    {
      id: 1,
      icon: FileEdit,
      title: 'Update Assignments',
      buttonText: 'Update',
      bgColor: 'bg-gradient-to-br from-blue-800 to-blue-950',
      iconBgColor: 'bg-blue-700',
      shadowColor: 'rgba(37, 99, 235, 0.6)',
      onClick: () => console.log('Update Assignments clicked')
    },
    {
      id: 2,
      icon: Calendar,
      title: 'Update Timetable',
      buttonText: 'Update',
      bgColor: 'bg-gradient-to-br from-cyan-800 to-cyan-950',
      iconBgColor: 'bg-cyan-700',
      shadowColor: 'rgba(6, 182, 212, 0.6)',
      onClick: () => console.log('Update Timetable clicked')
    },
    {
      id: 3,
      icon: Bell,
      title: 'Update Notices',
      buttonText: 'Update',
      bgColor: 'bg-gradient-to-br from-slate-800 to-slate-950',
      iconBgColor: 'bg-slate-700',
      shadowColor: 'rgba(71, 85, 105, 0.6)',
      onClick: () => console.log('Update Notices clicked')
    },
    {
      id: 4,
      icon: MessageSquare,
      title: 'Check Complaints',
      buttonText: 'Check',
      bgColor: 'bg-gradient-to-br from-teal-800 to-teal-950',
      iconBgColor: 'bg-teal-700',
      shadowColor: 'rgba(20, 184, 166, 0.6)',
      onClick: () => console.log('Check Complaints clicked')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-12 px-4 relative overflow-hidden">
      {/* Cartoon background elements with dark theme colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-20">☁️</div>
        <div className="absolute top-20 right-20 text-7xl animate-bounce delay-1000 opacity-20">☁️</div>
        <div className="absolute bottom-20 left-1/4 text-8xl animate-bounce delay-2000 opacity-20">☁️</div>
        <div className="absolute top-1/3 right-1/3 text-5xl animate-pulse opacity-30">⭐</div>
        <div className="absolute bottom-1/3 left-1/4 text-4xl animate-pulse delay-1000 opacity-30">✨</div>
        <div className="absolute top-2/3 right-1/4 text-4xl animate-pulse delay-2000 opacity-30">💫</div>
      </div>

      {/* Glowing orbs matching theme */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <FacultyCard
              key={card.id}
              icon={card.icon}
              title={card.title}
              subtitle={card.subtitle}
              buttonText={card.buttonText}
              bgColor={card.bgColor}
              iconBgColor={card.iconBgColor}
              shadowColor={card.shadowColor}
              onClick={card.onClick}
              index={index}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px) rotate(-2deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}