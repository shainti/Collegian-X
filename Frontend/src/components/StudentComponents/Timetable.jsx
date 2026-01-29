import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Download, BookOpen, User, MapPin, Loader2 } from 'lucide-react';

const TimetableViewer = () => {
  const [timetableData, setTimetableData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      // Replace with your API call
      // const response = await fetch('YOUR_API_URL', { credentials: 'include' });
      // const data = await response.json();
      
      // Sample data
      setTimeout(() => {
        setTimetableData({
          studentName: "Shainti Kashyap",
          department: "BCA",
          semester: "6th Semester",
          year: "2024-2025",
          schedule: {
            Monday: [
              { time: "09:00 - 10:00", subject: "Data Structures", teacher: "Dr. Sharma", room: "Room 101" },
              { time: "10:00 - 11:00", subject: "Web Development", teacher: "Prof. Verma", room: "Lab 2" },
              { time: "11:00 - 12:00", subject: "DBMS", teacher: "Dr. Singh", room: "Room 205" },
              { time: "12:00 - 01:00", subject: "Lunch Break", isBreak: true },
              { time: "01:00 - 02:00", subject: "Software Engineering", teacher: "Prof. Kumar", room: "Room 103" },
            ],
            Tuesday: [
              { time: "09:00 - 10:00", subject: "DBMS", teacher: "Dr. Singh", room: "Room 205" },
              { time: "10:00 - 11:00", subject: "Data Structures", teacher: "Dr. Sharma", room: "Room 101" },
              { time: "11:00 - 12:00", subject: "Web Development Lab", teacher: "Prof. Verma", room: "Lab 2" },
              { time: "12:00 - 01:00", subject: "Lunch Break", isBreak: true },
              { time: "01:00 - 02:00", subject: "AI & ML", teacher: "Dr. Patel", room: "Lab 3" },
            ],
            Wednesday: [
              { time: "09:00 - 10:00", subject: "Web Development", teacher: "Prof. Verma", room: "Lab 2" },
              { time: "10:00 - 11:00", subject: "DBMS Lab", teacher: "Dr. Singh", room: "Lab 1" },
              { time: "11:00 - 12:00", subject: "Data Structures", teacher: "Dr. Sharma", room: "Room 101" },
              { time: "12:00 - 01:00", subject: "Lunch Break", isBreak: true },
              { time: "01:00 - 02:00", subject: "Project Work", teacher: "Multiple", room: "Lab 4" },
            ],
            Thursday: [
              { time: "09:00 - 10:00", subject: "AI & ML", teacher: "Dr. Patel", room: "Lab 3" },
              { time: "10:00 - 11:00", subject: "Software Engineering", teacher: "Prof. Kumar", room: "Room 103" },
              { time: "11:00 - 12:00", subject: "DBMS", teacher: "Dr. Singh", room: "Room 205" },
              { time: "12:00 - 01:00", subject: "Lunch Break", isBreak: true },
              { time: "01:00 - 02:00", subject: "Web Development", teacher: "Prof. Verma", room: "Lab 2" },
            ],
            Friday: [
              { time: "09:00 - 10:00", subject: "Software Engineering", teacher: "Prof. Kumar", room: "Room 103" },
              { time: "10:00 - 11:00", subject: "AI & ML Lab", teacher: "Dr. Patel", room: "Lab 3" },
              { time: "11:00 - 12:00", subject: "DBMS", teacher: "Dr. Singh", room: "Room 205" },
              { time: "12:00 - 01:00", subject: "Lunch Break", isBreak: true },
              { time: "01:00 - 02:00", subject: "Sports/Library", isBreak: true },
            ],
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">Loading Timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-32 left-10 text-5xl animate-float">📅</div>
        <div className="absolute top-52 right-20 text-6xl animate-float-delayed">📚</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">⏰</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">📖</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">🎓</div>
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 mb-6 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My Timetable</h1>
                <p className="text-blue-200">Weekly class schedule</p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>

        {/* Student Info */}
        <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 rounded-3xl p-6 mb-6 border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-cyan-200 text-xs">Name</p>
                <p className="text-white font-semibold">{timetableData?.studentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-cyan-200 text-xs">Department</p>
                <p className="text-white font-semibold">{timetableData?.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-cyan-200 text-xs">Semester</p>
                <p className="text-white font-semibold">{timetableData?.semester}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-cyan-200 text-xs">Year</p>
                <p className="text-white font-semibold">{timetableData?.year}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timetable */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 border border-white/10 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left text-blue-200 font-semibold">Time</th>
                {days.map(day => (
                  <th key={day} className="p-4 text-center text-white font-semibold">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetableData?.schedule.Monday.map((_, timeIndex) => (
                <tr key={timeIndex} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-blue-200 font-medium text-sm">
                    {timetableData.schedule.Monday[timeIndex].time}
                  </td>
                  {days.map(day => {
                    const slot = timetableData?.schedule[day][timeIndex];
                    return (
                      <td key={day} className="p-2">
                        {slot?.isBreak ? (
                          <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-3 text-center">
                            <p className="text-yellow-300 font-semibold text-sm">{slot.subject}</p>
                          </div>
                        ) : (
                          <div className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all">
                            <p className="text-white font-semibold text-sm mb-1">{slot?.subject}</p>
                            <p className="text-blue-200 text-xs mb-1">{slot?.teacher}</p>
                            <p className="text-cyan-300 text-xs">{slot?.room}</p>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-blue-200 text-sm">Regular Class</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-blue-200 text-sm">Break Time</span>
          </div>
        </div>
      </div>

      <style jsx>{`
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
        
        @media print {
          body {
            background: white !important;
          }
          .bg-gradient-to-br {
            background: white !important;
          }
          .text-white, .text-blue-200, .text-cyan-300 {
            color: black !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TimetableViewer;