import React, { useState, useEffect } from 'react';
import { Users, Calendar, BookOpen, ArrowLeft, GraduationCap, History } from 'lucide-react';

// Shared styles for animations
const ANIMATIONS = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-25px) rotate(8deg); }
  }
  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-float-delayed { animation: float 4s ease-in-out infinite 1s; }
  .animate-float-delayed-2 { animation: float 4s ease-in-out infinite 2s; }
`;

// Background decorations component
const BackgroundEffects = ({ emojis }) => (
  <>
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {emojis.map((emoji, i) => (
        <div key={i} className={`absolute ${emoji.position} ${emoji.size} ${emoji.animation}`}>
          {emoji.icon}
        </div>
      ))}
    </div>
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
  </>
);

// Student Row Component
const StudentAttendanceRow = ({ student, onAttendanceUpdate, totalClasses }) => (
  <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
          {student.rollNo}
        </div>
        <h3 className="text-white font-semibold">{student.name}</h3>
      </div>
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

// Previous Attendance Row Component
const PreviousAttendanceRow = ({ record }) => {
  const percentage = ((record.attendedClasses / record.totalClasses) * 100).toFixed(1);
  const isLow = percentage < 75;
  const colorClass = isLow ? 'red' : 'green';

  return (
    <div className={`bg-gradient-to-br from-${colorClass}-600/10 to-${colorClass}-800/10 rounded-2xl p-4 border border-${colorClass}-400/20 hover:border-white/20 transition-all`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={`bg-gradient-to-br from-${colorClass}-500 to-${colorClass}-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
            {record.rollNo}
          </div>
          <div>
            <h3 className="text-white font-semibold">{record.name}</h3>
            <p className="text-blue-200 text-sm">{record.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-white text-sm mb-1">Attended</p>
            <p className="text-white font-bold text-lg">{record.attendedClasses}/{record.totalClasses}</p>
          </div>
          <div className={`bg-${colorClass}-500/20 border-${colorClass}-400/30 backdrop-blur-md border rounded-xl px-4 py-2`}>
            <p className={`text-${colorClass}-300 font-bold text-lg`}>{percentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Modal Component
const LoadingModal = ({ submitProgress }) => {
  const isSubmitting = submitProgress.total > 0;
  const progress = isSubmitting ? (submitProgress.current / submitProgress.total) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-slate-900/95 to-blue-900/95 rounded-3xl p-10 border border-white/20 shadow-2xl max-w-md w-full mx-4">
        <div className="text-center">
          {/* Simple Icon */}
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <div className="text-4xl">{isSubmitting ? '📤' : '⏳'}</div>
          </div>

          {isSubmitting ? (
            <>
              <h3 className="text-white text-2xl font-bold mb-2">Submitting Attendance</h3>
              <p className="text-blue-200 text-sm mb-6">Please wait...</p>
              
              {/* Progress Counter */}
              <div className="text-white text-3xl font-bold mb-4">
                {submitProgress.current} / {submitProgress.total}
              </div>
              
              {/* Simple Progress Bar */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <p className="text-emerald-300 font-semibold">{Math.round(progress)}%</p>
            </>
          ) : (
            <>
              <h3 className="text-white text-2xl font-bold mb-2">Loading</h3>
              <p className="text-blue-200 text-sm">Please wait...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Year Selection Card
const YearCard = ({ year, yearNum, onClick }) => {
  const colors = { 1: 'blue', 2: 'cyan', 3: 'purple' };
  const color = colors[yearNum];

  return (
    <div onClick={onClick} className={`bg-gradient-to-br from-${color}-600/20 to-${color}-800/20 rounded-3xl p-8 border border-white/10 cursor-pointer hover:scale-105 hover:border-white/30 transition-all duration-300 group`}>
      <div className={`bg-gradient-to-br from-${color}-500 to-${color}-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all`}>
        <Users className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white text-center mb-2">{year} Year</h2>
      <p className="text-blue-200 text-center mb-6">Click to load students</p>
      <button className="w-full bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
        Select Year
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </div>
  );
};

export default function FacultyMonthlyAttendance() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [totalClasses, setTotalClasses] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitProgress, setSubmitProgress] = useState({ current: 0, total: 0 });
  const [showPreviousAttendance, setShowPreviousAttendance] = useState(false);
  const [previousAttendanceData, setPreviousAttendanceData] = useState([]);

  const teacherSubjects = ['Mathematics', 'Physics'];

  // Fetch students when year selected
  useEffect(() => {
    if (!selectedYear) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/faculty/GetStudent?year=${selectedYear}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setStudents(data.students.map(s => ({
            id: s._id,
            rollNo: s.CollegeRollNo || 'N/A',
            name: s.FullName || 'Unknown',
            attendedClasses: ''
          })));
        } else {
          alert('Failed to load students');
        }
      } catch {
        alert('Error loading students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedYear]);

  // Fetch previous attendance
  const fetchPreviousAttendance = async () => {
    setLoading(true);
    try {
      const facultyId = JSON.parse(localStorage.getItem("Faculty"))?.id;
      const res = await fetch(
        `http://localhost:3000/api/faculty/GetPreviousAttendance?year=${selectedYear}&subject=${selectedSubject}&month=${selectedMonth}&facultyId=${facultyId}`,
        { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include" }
      );

      if (res.ok) {
        const data = await res.json();
        setPreviousAttendanceData(data.records || []);
        setShowPreviousAttendance(true);
      } else {
        alert('No previous attendance records found');
      }
    } catch {
      alert('Error loading previous attendance');
    } finally {
      setLoading(false);
    }
  };

  // Update student attendance
  const handleAttendanceUpdate = (studentId, value) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, attendedClasses: value } : s));
  };

  // Submit attendance
  const handleSubmit = async () => {
    if (!selectedSubject) return alert('Please select a subject!');
    if (!totalClasses || parseInt(totalClasses) <= 0) return alert('Please enter valid total classes!');

    const studentsWithAttendance = students.filter(s => s.attendedClasses !== '');
    if (studentsWithAttendance.length === 0) return alert('Please fill attendance for at least one student!');
    if (studentsWithAttendance.some(s => parseInt(s.attendedClasses) > parseInt(totalClasses))) {
      return alert('Attended classes cannot exceed total classes!');
    }

    setLoading(true);
    setSubmitProgress({ current: 0, total: studentsWithAttendance.length });

    let successCount = 0;
    const failedStudents = [];
    const facultyId = JSON.parse(localStorage.getItem("Faculty"))?.id;

    for (let i = 0; i < studentsWithAttendance.length; i++) {
      const student = studentsWithAttendance[i];
      try {
        const res = await fetch('http://localhost:3000/api/faculty/SubmitAttendance', {
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

        if (res.ok) successCount++;
        else failedStudents.push(student.name);
      } catch {
        failedStudents.push(student.name);
      }
      setSubmitProgress({ current: i + 1, total: studentsWithAttendance.length });
    }

    setLoading(false);
    setSubmitProgress({ current: 0, total: 0 });

    if (failedStudents.length === 0) {
      alert(`✅ Attendance submitted successfully for all ${successCount} students!`);
      setSelectedYear(null);
      setStudents([]);
      setTotalClasses('');
      setSelectedSubject('');
      setSelectedMonth('2026-01');
    } else {
      alert(`⚠️ Submitted: ${successCount}/${studentsWithAttendance.length}\n\nFailed for:\n${failedStudents.join(', ')}`);
    }
  };

  const yearOrdinal = selectedYear === '1' ? '1st' : selectedYear === '2' ? '2nd' : '3rd';

  // Year Selection Screen
  if (!selectedYear) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
        <BackgroundEffects emojis={[
          { position: 'top-32 left-10', size: 'text-5xl', animation: 'animate-float', icon: '📅' },
          { position: 'top-52 right-20', size: 'text-6xl', animation: 'animate-float-delayed', icon: '👨‍🏫' },
          { position: 'bottom-32 left-20', size: 'text-5xl', animation: 'animate-float-delayed-2', icon: '📊' },
          { position: 'top-1/2 right-10', size: 'text-4xl', animation: 'animate-float', icon: '🎓' },
          { position: 'bottom-20 right-1/3', size: 'text-5xl', animation: 'animate-float-delayed', icon: '🌟' }
        ]} />

        <div className="max-w-6xl mx-auto relative z-10 w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl mb-6 shadow-2xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Select Year</h1>
            <p className="text-blue-200 text-lg">Choose which year students' attendance you want to update</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['1st', '2nd', '3rd'].map((year, i) => (
              <YearCard key={i} year={year} yearNum={i + 1} onClick={() => setSelectedYear(String(i + 1))} />
            ))}
          </div>
        </div>
        <style jsx>{ANIMATIONS}</style>
      </div>
    );
  }

  // Previous Attendance Screen
  if (showPreviousAttendance) {
    const avgAttendance = previousAttendanceData.length > 0
      ? ((previousAttendanceData.reduce((sum, r) => sum + (r.attendedClasses / r.totalClasses), 0) / previousAttendanceData.length) * 100).toFixed(1)
      : 0;
    const belowThreshold = previousAttendanceData.filter(r => (r.attendedClasses / r.totalClasses) < 0.75).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BackgroundEffects emojis={[
          { position: 'top-32 left-10', size: 'text-5xl', animation: 'animate-float', icon: '📊' },
          { position: 'top-52 right-20', size: 'text-6xl', animation: 'animate-float-delayed', icon: '📈' },
          { position: 'bottom-32 left-20', size: 'text-5xl', animation: 'animate-float-delayed-2', icon: '📋' },
          { position: 'top-1/2 right-10', size: 'text-4xl', animation: 'animate-float', icon: '🎓' },
          { position: 'bottom-20 right-1/3', size: 'text-5xl', animation: 'animate-float-delayed', icon: '📅' }
        ]} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 mb-6 border border-white/10">
            <button onClick={() => setShowPreviousAttendance(false)} className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-5 h-5" />
              Back to Attendance Form
            </button>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                <History className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Previous Attendance Records</h1>
                <p className="text-blue-200">{yearOrdinal} Year - {selectedSubject} - {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 mb-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Attendance Records</h2>
            {previousAttendanceData.length === 0 ? (
              <div className="text-center py-12 text-blue-200">
                <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No previous attendance records found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {previousAttendanceData.map((record, i) => <PreviousAttendanceRow key={i} record={record} />)}
              </div>
            )}
          </div>

          {previousAttendanceData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { color: 'green', label: 'Total Students', value: previousAttendanceData.length },
                { color: 'blue', label: 'Average Attendance', value: `${avgAttendance}%` },
                { color: 'red', label: 'Below 75%', value: belowThreshold }
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br from-${stat.color}-600/20 to-${stat.color}-800/20 rounded-3xl p-6 border border-${stat.color}-400/20`}>
                  <p className={`text-${stat.color}-200 text-sm mb-2`}>{stat.label}</p>
                  <p className="text-white text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <style jsx>{ANIMATIONS}</style>
      </div>
    );
  }

  // Attendance Form Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {loading && <LoadingModal submitProgress={submitProgress} />}

      <BackgroundEffects emojis={[
        { position: 'top-32 left-10', size: 'text-5xl', animation: 'animate-float', icon: '📅' },
        { position: 'top-52 right-20', size: 'text-6xl', animation: 'animate-float-delayed', icon: '👨‍🏫' },
        { position: 'bottom-32 left-20', size: 'text-5xl', animation: 'animate-float-delayed-2', icon: '📊' },
        { position: 'top-1/2 right-10', size: 'text-4xl', animation: 'animate-float', icon: '📝' },
        { position: 'bottom-20 right-1/3', size: 'text-5xl', animation: 'animate-float-delayed', icon: '🎓' }
      ]} />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 mb-6 border border-white/10">
          <button onClick={() => setSelectedYear(null)} className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            Back to Year Selection
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{yearOrdinal} Year - Monthly Attendance</h1>
                <p className="text-blue-200">Mark attendance for your students</p>
              </div>
            </div>
            <button onClick={fetchPreviousAttendance} disabled={!selectedSubject || !selectedMonth || loading}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:scale-105 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <History className="w-5 h-5" />
              View Previous
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Your Subject', icon: BookOpen, color: 'cyan', type: 'select', value: selectedSubject, onChange: setSelectedSubject, options: teacherSubjects },
            { label: 'Month', icon: Calendar, color: 'purple', type: 'month', value: selectedMonth, onChange: setSelectedMonth },
            { label: 'Total Classes', icon: null, color: 'indigo', type: 'number', value: totalClasses, onChange: setTotalClasses }
          ].map((field, i) => (
            <div key={i} className={`bg-gradient-to-br from-${field.color}-600/20 to-${field.color}-800/20 rounded-3xl p-6 border border-white/10`}>
              <label className={`text-${field.color}-200 text-sm mb-3 block flex items-center gap-2`}>
                {field.icon && <field.icon className="w-4 h-4" />}
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select value={field.value} onChange={(e) => field.onChange(e.target.value)}
                  className={`w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-${field.color}-400 transition-all`}>
                  <option value="" className="bg-slate-900">Select Subject</option>
                  {field.options.map((opt) => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                </select>
              ) : (
                <input type={field.type} min={field.type === 'number' ? '1' : undefined}
                  value={field.value} onChange={(e) => field.onChange(e.target.value)}
                  placeholder={field.type === 'number' ? 'Enter total classes' : ''}
                  className={`w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white font-${field.type === 'number' ? 'semibold' : 'medium'} ${field.type === 'number' ? 'text-center' : ''} focus:outline-none focus:border-${field.color}-400 transition-all`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 mb-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Mark Attendance</h2>
              <p className="text-blue-200 text-sm mt-1">Enter attended classes for each student (Total: {totalClasses || '0'})</p>
            </div>
            <button onClick={() => setStudents(students.map(s => ({ ...s, attendedClasses: '' })))}
              className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-red-300 px-4 py-2 rounded-xl font-semibold hover:bg-red-500/30 transition-all text-sm">
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
                <StudentAttendanceRow key={student.id} student={student} onAttendanceUpdate={handleAttendanceUpdate} totalClasses={totalClasses} />
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-3xl p-6 mb-6 border border-yellow-400/20">
          <div className="flex gap-4">
            <div className="text-4xl">💡</div>
            <div className="flex-1">
              <h3 className="text-yellow-200 font-semibold mb-3">Instructions</h3>
              <ul className="text-yellow-100 text-sm space-y-2">
                {['Select your subject from the dropdown', 'Enter total number of classes conducted this month', 'For each student, enter how many classes they attended', 
                  'Attended classes cannot exceed total classes', 'Click Submit to save the attendance (submits one by one)', 'Use "View Previous" button to see past attendance records'].map((text, i) => (
                  <li key={i}>• {text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={handleSubmit} disabled={loading || students.length === 0}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:scale-105 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
            📤 Submit Attendance →
          </button>
        </div>
      </div>

      <style jsx>{ANIMATIONS}</style>
    </div>
  );
}