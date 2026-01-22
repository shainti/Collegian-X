import React, { useState } from 'react';
import { Download, Calendar, BookOpen, FileText, ArrowLeft } from 'lucide-react';

export default function AssignmentViewer() {

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  // Sample assignments data
  const assignments = [
    {
      id: 1,
      topic: "Data Structures and Algorithms",
      subject: "Computer Science",
      faculty: "Dr. Sarah Johnson",
      dueDate: "2026-02-15",
      assignedDate: "2026-01-20",
      questions: [
        "Explain the difference between Stack and Queue data structures with real-world examples.",
        "Implement a Binary Search Tree in your preferred programming language.",
        "What is the time complexity of Quick Sort? Explain with a detailed analysis.",
        "Write a program to detect a cycle in a linked list."
      ]
    },
    {
      id: 2,
      topic: "Web Development - React Hooks",
      subject: "Web Technologies",
      faculty: "Prof. Michael Chen",
      dueDate: "2026-02-10",
      assignedDate: "2026-01-18",
      questions: [
        "Explain the difference between useState and useEffect hooks.",
        "Create a custom hook for form validation.",
        "What are the rules of hooks in React?"
      ]
    },
    {
      id: 3,
      topic: "Database Normalization",
      subject: "Database Management",
      faculty: "Dr. Emily Rodriguez",
      dueDate: "2026-02-20",
      assignedDate: "2026-01-22",
      questions: [
        "Explain the different normal forms with examples.",
        "Normalize the given table to 3NF.",
        "What are the advantages of database normalization?"
      ]
    }
  ];
  



  // Download assignment as text file
  const handleDownload = (assignment) => {
    const content = `Assignment: ${assignment.topic}
Subject: ${assignment.subject}
Faculty: ${assignment.faculty}
Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}

Questions:
${assignment.questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${assignment.topic}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate days remaining
  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const days = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Get color based on days remaining
  const getCardColor = (days) => {
    if (days < 0) return "from-red-600/20 to-red-800/20";
    if (days <= 3) return "from-orange-600/20 to-orange-800/20";
    if (days <= 7) return "from-yellow-600/20 to-yellow-800/20";
    return "from-green-600/20 to-green-800/20";
  };

  const getBadgeColor = (days) => {
    if (days < 0) return "bg-red-500/20 text-red-300 border-red-400/30";
    if (days <= 3) return "bg-orange-500/20 text-orange-300 border-orange-400/30";
    if (days <= 7) return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
    return "bg-green-500/20 text-green-300 border-green-400/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-32 left-10 text-5xl animate-float">📝</div>
        <div className="absolute top-52 right-20 text-6xl animate-float-delayed">📚</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">✍️</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">📖</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">⏰</div>
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 mb-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Assignments</h1>
              <p className="text-blue-200">View and download your assignments</p>
            </div>
          </div>
        </div>

        {/* Show assignment grid or details */}
        {!selectedAssignment ? (
          // Assignment Cards Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => {
              const daysLeft = getDaysLeft(assignment.dueDate);
              
              return (
                <div
                  key={assignment._id}
                  onClick={() => setSelectedAssignment(assignment)}
                  className={`bg-gradient-to-br ${getCardColor(daysLeft)} rounded-3xl p-6 cursor-pointer border border-white/10 hover:scale-105 hover:border-white/20 transition-all duration-300`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white text-lg font-bold mb-2">{assignment.topic}</h3>
                      <p className="text-blue-200 text-sm">{assignment.subject}</p>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${getBadgeColor(daysLeft)}`}>
                      {daysLeft < 0 ? 'Overdue' : `${daysLeft}d left`}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-blue-100">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {assignment.faculty}
                    </div>
                    <div className="flex items-center text-sm text-blue-100">
                      <Calendar className="w-4 h-4 mr-2" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  <button className="w-full bg-white/10 text-white px-6 py-2.5 rounded-full font-semibold text-sm border border-white/20 hover:bg-white/20 transition-all">
                    View Details →
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          // Assignment Details View
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 md:p-8 border border-white/10">
            
            <button
              onClick={() => setSelectedAssignment(null)}
              className="mb-6 flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Assignments
            </button>

            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedAssignment.topic}</h2>
                <p className="text-blue-200 text-lg">{selectedAssignment.subject}</p>
              </div>
              <button
                onClick={() => handleDownload(selectedAssignment)}
                className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300">Faculty</p>
                    <p className="font-semibold text-white">{selectedAssignment.faculty}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300">Assigned</p>
                    <p className="font-semibold text-white">
                      {new Date(selectedAssignment.assignedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300">Due Date</p>
                    <p className="font-semibold text-white">
                      {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Assignment Questions</h3>
              </div>
              
              <div className="space-y-4">
                {selectedAssignment.questions.map((question, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-5 border-l-4 border-blue-400">
                    <p className="font-bold text-blue-300 mb-2">Question {index + 1}</p>
                    <p className="text-white">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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