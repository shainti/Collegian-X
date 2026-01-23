import React, { useEffect, useState } from "react";
import {
  Download,
  Calendar,
  BookOpen,
  FileText,
  ArrowLeft,
} from "lucide-react";

export default function AssignmentViewer() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/Faculty/assignment",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const result = await response.json();
      setAssignments(result.assignment || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = (assignment) => {
    const content = `Assignment: ${assignment.topic}
Subject: ${assignment.subject}
Faculty: ${assignment.faculty}
Assigned Date: ${new Date(assignment.assignedDate).toLocaleDateString()}
Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}

Questions:
${assignment.questions.map((q, i) => `${i + 1}. ${q}`).join("\n\n")}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${assignment.topic}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  const getCardColor = (days) => {
    if (days < 0) return "from-red-600/20 to-red-800/20";
    if (days <= 3) return "from-orange-600/20 to-orange-800/20";
    if (days <= 7) return "from-yellow-600/20 to-yellow-800/20";
    return "from-green-600/20 to-green-800/20";
  };

  const getBadgeColor = (days) => {
    if (days < 0) return "bg-red-500/20 text-red-300 border-red-400/30";
    if (days <= 3)
      return "bg-orange-500/20 text-orange-300 border-orange-400/30";
    if (days <= 7)
      return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
    return "bg-green-500/20 text-green-300 border-green-400/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
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

        {!selectedAssignment ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => {
              const daysLeft = getDaysLeft(assignment.dueDate);

              return (
                <div
                  key={assignment._id}
                  onClick={() => setSelectedAssignment(assignment)}
                  className={`bg-gradient-to-br ${getCardColor(daysLeft)} rounded-3xl p-6 cursor-pointer border border-white/10 hover:scale-105 hover:border-white/20 transition`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white text-lg font-bold mb-1">
                        {assignment.topic}
                      </h3>
                      <p className="text-blue-200 text-sm">
                        {assignment.subject}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full border ${getBadgeColor(
                        daysLeft
                      )}`}
                    >
                      {daysLeft < 0 ? "Overdue" : `${daysLeft}d left`}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-blue-100">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      {assignment.teacherName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Assigned:{" "}
                      {new Date(
                        assignment.assignedDate
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Due:{" "}
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-white/10 text-white px-6 py-2.5 rounded-full border border-white/20 hover:bg-white/20 transition">
                    View Details →
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* DETAILS VIEW */
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-8 border border-white/10">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="mb-6 flex items-center gap-2 text-blue-200 hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Assignments
            </button>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {selectedAssignment.topic}
                </h2>
                <p className="text-blue-200 text-lg">
                  {selectedAssignment.subject}
                </p>
              </div>

              <button
                onClick={() => handleDownload(selectedAssignment)}
                className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition"
              >
                <Download size={18} />
                Download
              </button>
            </div>

            {/* INFO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300">Faculty</p>
                    <p className="font-semibold text-white">
                      {selectedAssignment.teacherName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300">Assigned Date</p>
                    <p className="font-semibold text-white">
                      {new Date(
                        selectedAssignment.assignedDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300">Due Date</p>
                    <p className="font-semibold text-white">
                      {new Date(
                        selectedAssignment.dueDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QUESTIONS */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">
                Assignment Questions
              </h3>

              <div className="space-y-4">
                {selectedAssignment.questions.map((q, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-5 border-l-4 border-blue-400"
                  >
                    <p className="font-bold text-blue-300 mb-1">
                      Question {i + 1}
                    </p>
                    <p className="text-white">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-25px) rotate(8deg);
          }
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
