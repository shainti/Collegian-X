import React, { useState } from 'react';

const StudentAttendanceRow = ({ student, onAttendanceUpdate, index }) => {
  const [isActive, setIsActive] = useState(false);
  const [totalClasses, setTotalClasses] = useState(student.totalClasses || '');
  const [attendedClasses, setAttendedClasses] = useState(student.attendedClasses || '');

  const calculatePercentage = () => {
    if (totalClasses && attendedClasses) {
      const total = parseInt(totalClasses);
      const attended = parseInt(attendedClasses);
      if (total > 0 && attended <= total) {
        return ((attended / total) * 100).toFixed(1);
      }
    }
    return '0';
  };

  const percentage = calculatePercentage();

  const handleTotalChange = (value) => {
    setTotalClasses(value);
    onAttendanceUpdate(student.id, { totalClasses: value, attendedClasses });
  };

  const handleAttendedChange = (value) => {
    setAttendedClasses(value);
    onAttendanceUpdate(student.id, { totalClasses, attendedClasses: value });
  };

  const getStatusColor = () => {
    const perc = parseFloat(percentage);
    if (perc >= 90) return 'text-emerald-400';
    if (perc >= 75) return 'text-cyan-400';
    if (perc >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div
      className={`group relative bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl p-4 border border-white/10 transition-all duration-300 ${
        isActive ? 'scale-[1.02] border-white/20' : 'hover:scale-[1.02] hover:border-white/20'
      }`}
      style={{
        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s backwards`,
      }}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Student Info */}
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
            {student.rollNo}
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold">{student.name}</h4>
            <p className="text-white/60 text-sm">{student.email}</p>
          </div>
        </div>

        {/* Attendance Input Fields */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Total Classes */}
          <div className="flex-1 md:flex-none">
            <label className="block text-white/60 text-xs mb-1">Total Classes</label>
            <input
              type="number"
              min="0"
              value={totalClasses}
              onChange={(e) => handleTotalChange(e.target.value)}
              placeholder="0"
              className="w-full md:w-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 text-white font-semibold text-center focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          {/* Attended Classes */}
          <div className="flex-1 md:flex-none">
            <label className="block text-white/60 text-xs mb-1">Attended</label>
            <input
              type="number"
              min="0"
              max={totalClasses || undefined}
              value={attendedClasses}
              onChange={(e) => handleAttendedChange(e.target.value)}
              placeholder="0"
              className="w-full md:w-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 text-white font-semibold text-center focus:outline-none focus:border-emerald-400 transition-all"
            />
          </div>

          {/* Percentage Display */}
          <div className="flex-1 md:flex-none">
            <label className="block text-white/60 text-xs mb-1">Percentage</label>
            <div className={`w-full md:w-24 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-center ${getStatusColor()} font-bold`}>
              {percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalClasses && attendedClasses && (
        <div className="mt-4">
          <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm border border-white/5">
            <div
              className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function FacultyMonthlyAttendance() {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [students, setStudents] = useState([
    {
      id: 1,
      rollNo: '01',
      name: 'Aarav Sharma',
      email: 'aarav@college.edu',
      totalClasses: '',
      attendedClasses: ''
    },
    {
      id: 2,
      rollNo: '02',
      name: 'Diya Patel',
      email: 'diya@college.edu',
      totalClasses: '',
      attendedClasses: ''
    },
    {
      id: 3,
      rollNo: '03',
      name: 'Arjun Kumar',
      email: 'arjun@college.edu',
      totalClasses: '',
      attendedClasses: ''
    },
    {
      id: 4,
      rollNo: '04',
      name: 'Ananya Singh',
      email: 'ananya@college.edu',
      totalClasses: '',
      attendedClasses: ''
    },
    {
      id: 5,
      rollNo: '05',
      name: 'Vihaan Reddy',
      email: 'vihaan@college.edu',
      totalClasses: '',
      attendedClasses: ''
    },
    {
      id: 6,
      rollNo: '06',
      name: 'Isha Gupta',
      email: 'isha@college.edu',
      totalClasses: '',
      attendedClasses: ''
    },
    {
      id: 7,
      rollNo: '07',
      name: 'Reyansh Mehta',
      email: 'reyansh@college.edu',
      totalClasses: '',
      attendedClasses: ''
    },
    {
      id: 8,
      rollNo: '08',
      name: 'Saanvi Verma',
      email: 'saanvi@college.edu',
      totalClasses: '',
      attendedClasses: ''
    }
  ]);

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'English',
    'Computer Science'
  ];

  const handleAttendanceUpdate = (studentId, data) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, ...data }
        : student
    ));
  };

  const handleBulkFill = () => {
    const totalClasses = prompt('Enter total classes for all students:');
    if (totalClasses && !isNaN(totalClasses)) {
      setStudents(students.map(student => ({
        ...student,
        totalClasses: totalClasses,
        attendedClasses: student.attendedClasses || ''
      })));
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all attendance data?')) {
      setStudents(students.map(student => ({
        ...student,
        totalClasses: '',
        attendedClasses: ''
      })));
    }
  };

  const handleSubmit = () => {
    const filledStudents = students.filter(s => s.totalClasses && s.attendedClasses);
    
    if (filledStudents.length === 0) {
      alert('Please fill attendance data for at least one student!');
      return;
    }

    const invalidStudents = filledStudents.filter(s => 
      parseInt(s.attendedClasses) > parseInt(s.totalClasses)
    );

    if (invalidStudents.length > 0) {
      alert('Error: Attended classes cannot be greater than total classes for some students!');
      return;
    }

    const monthName = new Date(selectedMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    alert(`Monthly Attendance Submitted Successfully!\n\nSubject: ${selectedSubject}\nMonth: ${monthName}\nStudents Updated: ${filledStudents.length}/${students.length}`);
    
    // Reset after submission
    handleClearAll();
  };

  const getStats = () => {
    const filled = students.filter(s => s.totalClasses && s.attendedClasses);
    const totalStudents = students.length;
    const avgPercentage = filled.length > 0
      ? (filled.reduce((sum, s) => {
          const perc = (parseInt(s.attendedClasses) / parseInt(s.totalClasses)) * 100;
          return sum + perc;
        }, 0) / filled.length).toFixed(1)
      : '0';

    return {
      totalStudents,
      filled: filled.length,
      pending: totalStudents - filled.length,
      avgPercentage
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* FLOATING EMOJIS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-32 left-10 text-5xl animate-float">📅</div>
        <div className="absolute top-52 right-20 text-6xl animate-float-delayed">👨‍🏫</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">📊</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">📝</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">🎓</div>
        <div className="absolute top-1/3 left-1/4 text-4xl animate-spin-slow">⚡</div>
        <div className="absolute bottom-1/3 right-1/4 text-4xl animate-pulse">💡</div>
      </div>

      {/* GRADIENT ORBS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-delayed" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-delayed-2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div 
          className="bg-gradient-to-br from-indigo-600/20 via-indigo-700/20 to-indigo-800/20 rounded-3xl p-8 mb-8 border border-white/10 backdrop-blur-md"
          style={{ animation: 'fadeInUp 0.6s ease-out backwards' }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Monthly Attendance Upload</h1>
          <p className="text-white/70">Upload attendance data for the entire month with total and attended classes</p>
        </div>

        {/* Controls Section */}
        <div 
          className="bg-gradient-to-br from-cyan-600/20 via-cyan-700/20 to-cyan-800/20 rounded-3xl p-6 mb-8 border border-white/10 backdrop-blur-md"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Subject Selection */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-400 transition-all"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject} className="bg-slate-900">
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selection */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Select Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            {/* Quick Actions */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Quick Actions</label>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkFill}
                  className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Bulk Fill
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 bg-gradient-to-br from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <p className="text-white/60 text-xs mb-1">Total Students</p>
              <p className="text-white text-2xl font-bold">{stats.totalStudents}</p>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-md rounded-xl p-4 border border-emerald-500/30">
              <p className="text-emerald-300 text-xs mb-1">Data Filled</p>
              <p className="text-white text-2xl font-bold">{stats.filled}</p>
            </div>
            <div className="bg-yellow-500/20 backdrop-blur-md rounded-xl p-4 border border-yellow-500/30">
              <p className="text-yellow-300 text-xs mb-1">Pending</p>
              <p className="text-white text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-cyan-500/20 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30">
              <p className="text-cyan-300 text-xs mb-1">Avg Attendance</p>
              <p className="text-white text-2xl font-bold">{stats.avgPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div 
          className="bg-gradient-to-br from-blue-600/20 via-blue-700/20 to-blue-800/20 rounded-3xl p-6 mb-8 border border-white/10 backdrop-blur-md"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s backwards' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Student Attendance - {selectedSubject}</h2>
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
              <span className="text-white/70 text-sm">Month: </span>
              <span className="text-white font-semibold">
                {new Date(selectedMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {students.map((student, index) => (
              <StudentAttendanceRow
                key={student.id}
                student={student}
                onAttendanceUpdate={handleAttendanceUpdate}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div 
          className="bg-gradient-to-br from-yellow-600/20 via-orange-700/20 to-orange-800/20 rounded-3xl p-6 mb-8 border border-white/10 backdrop-blur-md"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.3s backwards' }}
        >
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              <span className="text-3xl relative z-10">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-2">How to Use</h3>
              <ul className="text-white/70 text-sm leading-relaxed space-y-1">
                <li>• Enter <span className="text-cyan-400 font-bold">Total Classes</span> conducted in the month for each student</li>
                <li>• Enter <span className="text-emerald-400 font-bold">Attended Classes</span> for each student</li>
                <li>• Use <span className="text-purple-400 font-bold">Bulk Fill</span> to set same total classes for all students</li>
                <li>• Percentage is automatically calculated for each student</li>
                <li>• Click <span className="text-purple-400 font-bold">Submit</span> when all data is filled</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div 
          className="flex justify-center"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.4s backwards' }}
        >
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl border border-white/20 flex items-center gap-3"
          >
            <span>📤</span>
            Submit Monthly Attendance
            <span>→</span>
          </button>
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