import React, { useState, useEffect } from 'react';
import { Users, Calendar, BookOpen, ArrowLeft, GraduationCap } from 'lucide-react';

const StudentAttendanceRow = ({ student, onAttendanceUpdate, totalClasses }) => {
  const [attendedClasses, setAttendedClasses] = useState(student.attendedClasses || '');

  const handleAttendedChange = (value) => {
    setAttendedClasses(value);
    onAttendanceUpdate(student.id, value);
  };

  return (
    <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Student Info */}
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
            {student.rollNo}
          </div>
          <div>
            <h3 className="text-white font-semibold">{student.name}</h3>
          </div>
        </div>

        {/* Attended Classes Input */}
        <div className="w-32">
          <input
            type="number"
            min="0"
            max={totalClasses || undefined}
            value={attendedClasses}
            onChange={(e) => handleAttendedChange(e.target.value)}
            placeholder="0"
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 text-white font-semibold text-center focus:outline-none focus:border-emerald-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default function FacultyMonthlyAttendance() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [totalClasses, setTotalClasses] = useState('');
  const [teacherName, setTeacherName] = useState('');
  
  const [allStudents] = useState({
    '1': [
      { id: 1, rollNo: '01', name: 'Aarav Sharma', year: 1, attendedClasses: '' },
      { id: 2, rollNo: '02', name: 'Diya Patel', year: 1, attendedClasses: '' },
      { id: 3, rollNo: '03', name: 'Arjun Kumar', year: 1, attendedClasses: '' },
      { id: 4, rollNo: '04', name: 'Ananya Singh', year: 1, attendedClasses: '' },
    ],
    '2': [
      { id: 5, rollNo: '05', name: 'Vihaan Reddy', year: 2, attendedClasses: '' },
      { id: 6, rollNo: '06', name: 'Isha Gupta', year: 2, attendedClasses: '' },
      { id: 7, rollNo: '07', name: 'Reyansh Mehta', year: 2, attendedClasses: '' },
      { id: 8, rollNo: '08', name: 'Saanvi Verma', year: 2, attendedClasses: '' },
    ],
    '3': [
      { id: 9, rollNo: '09', name: 'Aditya Joshi', year: 3, attendedClasses: '' },
      { id: 10, rollNo: '10', name: 'Kavya Nair', year: 3, attendedClasses: '' },
      { id: 11, rollNo: '11', name: 'Rohan Iyer', year: 3, attendedClasses: '' },
      { id: 12, rollNo: '12', name: 'Priya Das', year: 3, attendedClasses: '' },
    ]
  });

  const [students, setStudents] = useState([]);

  // Teacher's subjects - Replace with actual teacher data from your backend
  const teacherSubjects = ['Mathematics', 'Physics']; // Only subjects this teacher teaches

  useEffect(() => {
    // Fetch teacher info from localStorage or API
    const facultyData = JSON.parse(localStorage.getItem('Faculty') || '{}');
    setTeacherName(facultyData.TeacherName || 'Teacher');
    // You can also set teacherSubjects from backend here
  }, []);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setStudents(allStudents[year].map(s => ({ ...s, attendedClasses: '' })));
  };

  const handleBackToYearSelection = () => {
    setSelectedYear(null);
    setStudents([]);
    setTotalClasses('');
    setSelectedSubject('');
  };

  const handleAttendanceUpdate = (studentId, attendedClasses) => {
    setStudents(students.map(student =>
      student.id === studentId ? { ...student, attendedClasses } : student
    ));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all attendance data?')) {
      setStudents(students.map(student => ({
        ...student,
        attendedClasses: ''
      })));
    }
  };

  const handleSubmit = () => {
    if (!totalClasses || totalClasses === '0') {
      alert('Please enter total classes conducted!');
      return;
    }

    if (!selectedSubject) {
      alert('Please select a subject!');
      return;
    }

    const filledStudents = students.filter(s => s.attendedClasses !== '');
    
    if (filledStudents.length === 0) {
      alert('Please fill attendance for at least one student!');
      return;
    }

    const invalidStudents = filledStudents.filter(s =>
      parseInt(s.attendedClasses) > parseInt(totalClasses)
    );

    if (invalidStudents.length > 0) {
      alert('Error: Attended classes cannot be greater than total classes for some students!');
      return;
    }

    const monthName = new Date(selectedMonth + '-01').toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric'
    });

    alert(`Attendance Submitted Successfully!\n\nYear: ${selectedYear}${selectedYear === '1' ? 'st' : selectedYear === '2' ? 'nd' : 'rd'} Year\nSubject: ${selectedSubject}\nMonth: ${monthName}\nTotal Classes: ${totalClasses}\nStudents Updated: ${filledStudents.length}/${students.length}`);

    // Send to backend here
    console.log({
      year: selectedYear,
      subject: selectedSubject,
      month: selectedMonth,
      totalClasses,
      teacherName,
      students: filledStudents
    });

    handleBackToYearSelection();
  };

  // Year Selection Screen
  if (!selectedYear) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-32 left-10 text-5xl animate-float">📅</div>
          <div className="absolute top-52 right-20 text-6xl animate-float-delayed">👨‍🏫</div>
          <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">📊</div>
          <div className="absolute top-1/2 right-10 text-4xl animate-float">🎓</div>
          <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">🌟</div>
        </div>

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10 w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl mb-6 shadow-2xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Select Year</h1>
            <p className="text-blue-200 text-lg">Choose which year students' attendance you want to update</p>
          </div>

          {/* Year Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { year: '1', label: '1st Year', color: 'from-blue-600/20 to-blue-800/20', iconColor: 'from-blue-500 to-blue-600', students: 4 },
              { year: '2', label: '2nd Year', color: 'from-cyan-600/20 to-cyan-800/20', iconColor: 'from-cyan-500 to-cyan-600', students: 4 },
              { year: '3', label: '3rd Year', color: 'from-purple-600/20 to-purple-800/20', iconColor: 'from-purple-500 to-purple-600', students: 4 }
            ].map((item) => (
              <div
                key={item.year}
                onClick={() => handleYearSelect(item.year)}
                className={`bg-gradient-to-br ${item.color} rounded-3xl p-8 border border-white/10 cursor-pointer hover:scale-105 hover:border-white/30 transition-all duration-300 group`}
              >
                <div className={`bg-gradient-to-br ${item.iconColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all`}>
                  <Users className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-white text-center mb-2">{item.label}</h2>
                <p className="text-blue-200 text-center mb-6">{item.students} Students</p>
                
                <button className="w-full bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  Select Year
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            ))}
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
        `}</style>
      </div>
    );
  }

  // Attendance Form Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-32 left-10 text-5xl animate-float">📅</div>
        <div className="absolute top-52 right-20 text-6xl animate-float-delayed">👨‍🏫</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">📊</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">📝</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">🎓</div>
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header with Back Button */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 mb-6 border border-white/10">
          <button
            onClick={handleBackToYearSelection}
            className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Year Selection
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {selectedYear}{selectedYear === '1' ? 'st' : selectedYear === '2' ? 'nd' : 'rd'} Year - Attendance
              </h1>
              <p className="text-blue-200">Mark attendance for your students</p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Subject Selection */}
          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 rounded-3xl p-6 border border-white/10">
            <label className="text-cyan-200 text-sm mb-3 block flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Your Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-400 transition-all"
            >
              <option value="" className="bg-slate-900">Select Subject</option>
              {teacherSubjects.map((subject) => (
                <option key={subject} value={subject} className="bg-slate-900">
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selection */}
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-3xl p-6 border border-white/10">
            <label className="text-purple-200 text-sm mb-3 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-purple-400 transition-all"
            />
          </div>

          {/* Total Classes */}
          <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 rounded-3xl p-6 border border-white/10">
            <label className="text-indigo-200 text-sm mb-3 block">Total Classes</label>
            <input
              type="number"
              min="1"
              value={totalClasses}
              onChange={(e) => setTotalClasses(e.target.value)}
              placeholder="Enter total classes"
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white font-semibold text-center focus:outline-none focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Students List */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 mb-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Mark Attendance</h2>
              <p className="text-blue-200 text-sm mt-1">
                Enter attended classes for each student (Total: {totalClasses || '0'})
              </p>
            </div>
            <button
              onClick={handleClearAll}
              className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-red-300 px-4 py-2 rounded-xl font-semibold hover:bg-red-500/30 transition-all text-sm"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-3">
            {students.map((student, index) => (
              <StudentAttendanceRow
                key={student.id}
                student={student}
                onAttendanceUpdate={handleAttendanceUpdate}
                totalClasses={totalClasses}
              />
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-3xl p-6 mb-6 border border-yellow-400/20">
          <div className="flex gap-4">
            <div className="text-4xl">💡</div>
            <div className="flex-1">
              <h3 className="text-yellow-200 font-semibold mb-3">Instructions</h3>
              <ul className="text-yellow-100 text-sm space-y-2">
                <li>• Select your subject from the dropdown</li>
                <li>• Enter total number of classes conducted this month</li>
                <li>• For each student, enter how many classes they attended</li>
                <li>• Attended classes cannot exceed total classes</li>
                <li>• Click Submit to save the attendance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:scale-105 inline-flex items-center gap-3"
          >
            📤 Submit Attendance →
          </button>
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
      `}</style>
    </div>
  );
}