import React, { useState } from 'react';

const SubjectCard = ({ subject, index }) => {
  const [isActive, setIsActive] = useState(false);

  const calculatePercentage = (attended, total) => {
    return ((attended / total) * 100).toFixed(1);
  };

  const percentage = calculatePercentage(subject.attendedClasses, subject.totalClasses);

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 90) return { text: 'Excellent', color: 'text-emerald-400' };
    if (percentage >= 75) return { text: 'Good', color: 'text-cyan-400' };
    if (percentage >= 60) return { text: 'Average', color: 'text-yellow-400' };
    return { text: 'Low', color: 'text-red-400' };
  };

  const status = getAttendanceStatus(percentage);

  const handleTouchStart = () => {
    setIsActive(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsActive(false), 300);
  };

  return (
    <div
      className={`group relative ${subject.bgColor} rounded-3xl p-6 flex flex-col border border-white/10 transition-all duration-500 ease-out ${
        isActive ? 'scale-105 -translate-y-2 border-white/20' : 'hover:scale-105 hover:-translate-y-2 hover:border-white/20'
      }`}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
      }}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl transition-opacity duration-500 ${
        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`} />

      {/* Animated glow */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${subject.bgColor} rounded-3xl blur-xl transition-opacity duration-500 ${
          isActive ? 'opacity-30' : 'opacity-0 group-hover:opacity-30'
        }`}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-white text-xl font-bold transition-transform duration-300 ${
            isActive ? 'scale-105' : 'group-hover:scale-105'
          }`}>
            {subject.name}
          </h3>
          <div className={`${subject.iconColor} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
            isActive ? 'shadow-xl scale-110 -translate-y-1' : 'group-hover:shadow-xl group-hover:scale-110 group-hover:-translate-y-1'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
            <span className="text-2xl relative z-10">{subject.icon}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-white/70 text-sm font-medium">Attendance Progress</span>
            <span className={`text-sm font-bold ${status.color}`}>{percentage}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm border border-white/5">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${subject.iconColor} shadow-lg`}
              style={{ 
                width: `${percentage}%`,
                animation: `progressFill 1.5s ease-out ${index * 0.2}s backwards`
              }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-white/60 text-xs mb-1">Total Classes</p>
            <p className="text-white text-2xl font-bold">{subject.totalClasses}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-white/60 text-xs mb-1">Attended</p>
            <p className="text-white text-2xl font-bold">{subject.attendedClasses}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-white/60 text-sm">Status:</span>
          <span className={`${status.color} font-bold text-sm px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20`}>
            {status.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function StudentAttendance() {
  const [subjects] = useState([
    {
      id: 1,
      name: 'Mathematics',
      totalClasses: 45,
      attendedClasses: 42,
      bgColor: 'bg-gradient-to-br from-blue-600/20 via-blue-700/20 to-blue-800/20',
      iconColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: '📐'
    },
    {
      id: 2,
      name: 'Physics',
      totalClasses: 40,
      attendedClasses: 38,
      bgColor: 'bg-gradient-to-br from-cyan-600/20 via-cyan-700/20 to-cyan-800/20',
      iconColor: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      icon: '⚛️'
    },
    {
      id: 3,
      name: 'Chemistry',
      totalClasses: 38,
      attendedClasses: 35,
      bgColor: 'bg-gradient-to-br from-teal-600/20 via-teal-700/20 to-teal-800/20',
      iconColor: 'bg-gradient-to-br from-teal-500 to-teal-600',
      icon: '🧪'
    },
    {
      id: 4,
      name: 'English',
      totalClasses: 35,
      attendedClasses: 33,
      bgColor: 'bg-gradient-to-br from-emerald-600/20 via-emerald-700/20 to-emerald-800/20',
      iconColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      icon: '📚'
    },
    {
      id: 5,
      name: 'Computer Science',
      totalClasses: 42,
      attendedClasses: 40,
      bgColor: 'bg-gradient-to-br from-purple-600/20 via-purple-700/20 to-purple-800/20',
      iconColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: '💻'
    }
  ]);

  const totalClassesAll = subjects.reduce((sum, sub) => sum + sub.totalClasses, 0);
  const totalAttendedAll = subjects.reduce((sum, sub) => sum + sub.attendedClasses, 0);
  const overallPercentage = ((totalAttendedAll / totalClassesAll) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* FLOATING EMOJIS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-32 left-10 text-5xl animate-float">📊</div>
        <div className="absolute top-52 right-20 text-6xl animate-float-delayed">📈</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">✅</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">📝</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">🌟</div>
        <div className="absolute top-1/3 left-1/4 text-4xl animate-spin-slow">⚡</div>
        <div className="absolute bottom-1/3 right-1/4 text-4xl animate-pulse">💡</div>
      </div>

      {/* GRADIENT ORBS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-delayed" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-delayed-2" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Card */}
        <div 
          className="bg-gradient-to-br from-indigo-600/20 via-indigo-700/20 to-indigo-800/20 rounded-3xl p-8 mb-8 border border-white/10 backdrop-blur-md"
          style={{ animation: 'fadeInUp 0.6s ease-out backwards' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Attendance Overview</h1>
              <p className="text-white/70">Track your class attendance across all subjects</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-w-[200px]">
              <p className="text-white/70 text-sm mb-1">Overall Attendance</p>
              <p className="text-white text-5xl font-bold">{overallPercentage}%</p>
              <div className="mt-4 flex gap-4 text-sm">
                <div>
                  <p className="text-white/60">Total</p>
                  <p className="text-white font-bold">{totalClassesAll}</p>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <p className="text-white/60">Attended</p>
                  <p className="text-white font-bold">{totalAttendedAll}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {subjects.map((subject, index) => (
            <SubjectCard key={subject.id} subject={subject} index={index} />
          ))}
        </div>

        {/* Info Card */}
        <div 
          className="mt-8 bg-gradient-to-br from-yellow-600/20 via-orange-700/20 to-orange-800/20 rounded-3xl p-6 border border-white/10 backdrop-blur-md"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.6s backwards' }}
        >
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              <span className="text-3xl relative z-10">⚠️</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-2">Attendance Guidelines</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Maintain at least <span className="text-cyan-400 font-bold">75% attendance</span> in each subject to be eligible for exams. 
                Excellent attendance (<span className="text-emerald-400 font-bold">90%+</span>) may qualify you for bonus marks.
              </p>
            </div>
          </div>
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
        @keyframes progressFill {
          from {
            width: 0%;
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