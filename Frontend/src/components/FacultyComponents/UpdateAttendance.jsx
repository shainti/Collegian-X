import React, { useState, useEffect } from 'react';
import { Users, Calendar, BookOpen, ArrowLeft, GraduationCap } from 'lucide-react';

// Student Row Component
const StudentAttendanceRow = ({ student, onAttendanceUpdate, totalClasses }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Student Info */}
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
            {student.rollNo}
          </div>
          <h3 className="text-white font-semibold">{student.name}</h3>
        </div>

        {/* Input */}
        <div className="w-32">
          <input
            type="number"
            min="0"
            max={totalClasses}
            value={student.attendedClasses}
            onChange={(e) => onAttendanceUpdate(student.id, e.target.value)}
            placeholder="0"
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 text-white font-semibold text-center focus:outline-none focus:border-emerald-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default function FacultyMonthlyAttendance() {
  // States
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [totalClasses, setTotalClasses] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitProgress, setSubmitProgress] = useState({ current: 0, total: 0 });

  const teacherSubjects = ['Mathematics', 'Physics'];

  // Fetch students when year selected
  useEffect(() => {
    if (!selectedYear) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/faculty/GetStudent?year=${selectedYear}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStudents(data.students.map(s => ({
            id: s._id,
            rollNo: s.CollegeRollNo || 'N/A',    
            name: s.FullName || 'Unknown',       
            attendedClasses: ''
          })));
        } else {
          alert('Failed to load students');
        }
      } catch (error) {
        alert('Error loading students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedYear]);

  // Update student attendance
  const handleAttendanceUpdate = (studentId, value) => {
    setStudents(students.map(s =>
      s.id === studentId ? { ...s, attendedClasses: value } : s
    ));
  };

  // Simplified Submit - One student at a time
  const handleSubmit = async () => {
    // Basic validations
    if (!selectedSubject) {
      alert('Please select a subject!');
      return;
    }

    if (!totalClasses || parseInt(totalClasses) <= 0) {
      alert('Please enter valid total classes!');
      return;
    }

    // Get students with attendance filled
    const studentsWithAttendance = students.filter(s => s.attendedClasses !== '');

    if (studentsWithAttendance.length === 0) {
      alert('Please fill attendance for at least one student!');
      return;
    }

    // Check if any attendance exceeds total classes
    const hasInvalid = studentsWithAttendance.some(
      s => parseInt(s.attendedClasses) > parseInt(totalClasses)
    );

    if (hasInvalid) {
      alert('Attended classes cannot exceed total classes!');
      return;
    }

    // Submit each student one by one
    setLoading(true);
    setSubmitProgress({ current: 0, total: studentsWithAttendance.length });

    let successCount = 0;
    let failedStudents = [];

    for (let i = 0; i < studentsWithAttendance.length; i++) {
      const student = studentsWithAttendance[i];

    const facultyData = JSON.parse(localStorage.getItem("Faculty"));
    const facultyId = facultyData?.id; 
      try {
        const response = await fetch('http://localhost:3000/api/faculty/SubmitAttendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            studentId: student.id,
            facultyId,
            year: selectedYear,
            subject: selectedSubject,
            month: selectedMonth,
            totalClasses: parseInt(totalClasses),
            attendedClasses: parseInt(student.attendedClasses)
          })
        });

        if (response.ok) {
          successCount++;
        } else {
          failedStudents.push(student.name);
        }
      } catch (error) {
        failedStudents.push(student.name);
      }

      // Update progress
      setSubmitProgress({ current: i + 1, total: studentsWithAttendance.length });
    }

    setLoading(false);
    setSubmitProgress({ current: 0, total: 0 });

    // Show results
    if (failedStudents.length === 0) {
      alert(`✅ Attendance submitted successfully for all ${successCount} students!`);
      // Reset form
      setSelectedYear(null);
      setStudents([]);
      setTotalClasses('');
      setSelectedSubject('');
      setSelectedMonth('2026-01');
    } else {
      alert(
        `⚠️ Submitted: ${successCount}/${studentsWithAttendance.length}\n\nFailed for:\n${failedStudents.join(', ')}`
      );
    }
  };

  // SCREEN 1: Year Selection
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
            <div
              onClick={() => setSelectedYear('1')}
              className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-8 border border-white/10 cursor-pointer hover:scale-105 hover:border-white/30 transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white text-center mb-2">1st Year</h2>
              <p className="text-blue-200 text-center mb-6">Click to load students</p>
              <button className="w-full bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                Select Year
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <div
              onClick={() => setSelectedYear('2')}
              className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 rounded-3xl p-8 border border-white/10 cursor-pointer hover:scale-105 hover:border-white/30 transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white text-center mb-2">2nd Year</h2>
              <p className="text-blue-200 text-center mb-6">Click to load students</p>
              <button className="w-full bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                Select Year
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <div
              onClick={() => setSelectedYear('3')}
              className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-3xl p-8 border border-white/10 cursor-pointer hover:scale-105 hover:border-white/30 transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white text-center mb-2">3rd Year</h2>
              <p className="text-blue-200 text-center mb-6">Click to load students</p>
              <button className="w-full bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                Select Year
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
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
        `}</style>
      </div>
    );
  }

  // SCREEN 2: Attendance Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gradient-to-br from-blue-600/80 to-blue-800/80 rounded-3xl p-8 border border-white/20">
            {submitProgress.total > 0 ? (
              <div className="text-center">
                <div className="text-white text-xl font-semibold mb-4">
                  Submitting Attendance...
                </div>
                <div className="text-blue-200 text-lg">
                  {submitProgress.current} / {submitProgress.total} students
                </div>
                <div className="w-64 h-2 bg-white/20 rounded-full mt-4">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${(submitProgress.current / submitProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-white text-xl font-semibold">Loading...</div>
            )}
          </div>
        </div>
      )}

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
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 mb-6 border border-white/10">
          <button
            onClick={() => setSelectedYear(null)}
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
                {selectedYear === '1' ? '1st' : selectedYear === '2' ? '2nd' : '3rd'} Year - Monthly Attendance
              </h1>
              <p className="text-blue-200">Mark attendance for your students</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              onClick={() => setStudents(students.map(s => ({ ...s, attendedClasses: '' })))}
              className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-red-300 px-4 py-2 rounded-xl font-semibold hover:bg-red-500/30 transition-all text-sm"
            >
              Clear All
            </button>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-12 text-blue-200">
              <p className="text-lg">No students found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <StudentAttendanceRow
                  key={student.id}
                  student={student}
                  onAttendanceUpdate={handleAttendanceUpdate}
                  totalClasses={totalClasses}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
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
                <li>• Click Submit to save the attendance (submits one by one)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={loading || students.length === 0}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:scale-105 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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