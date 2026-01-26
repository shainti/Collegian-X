import React, { useState } from "react";
import { useEffect } from "react";

import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
  Calendar,
  BookOpen,
} from "lucide-react";

export default function FacultyAssignmentManager() {
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState(["", ""]);
  const [assignmentList, setAssignmentList] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Calculate days left
  const calculateDaysLeft = (dueDate) => {
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

  const handleAddNew = () => {
    setQuestions(["", ""]);
    setShowForm(true);
  };

  const handleEdit = (assignment) => {
    console.log("Edit Assignment:", assignment);
    setShowForm(true);
  };
  const handleDelete = (id) => {
    console.log("Delete Assignment ID:", id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
//fetch for add assignment
    try {
      await fetch("http://localhost:3000/api/Faculty/assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          topic: formData.get("Topic"),
          subject: formData.get("Subject"),
          teacherName: formData.get("TeacherName"),
          year: formData.get("Year"),
          assignedDate: formData.get("AssignedDate"),
          dueDate: formData.get("DueDate"),
          questions: questions.filter((q) => q.trim() !== ""),
        }),
      });
    } catch (error) {}
    setShowForm(false);
  };
  //fetch for get assignment
  const fetchAssignments = async () => {
    const getresponse = await fetch(
      "http://localhost:3000/api/Faculty/assignment",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    // const result = await getresponse.json();
    // console.log(result);
    // setAssignmentList(result.assignment);
    const result = await getresponse.json();

const Faculty = JSON.parse(localStorage.getItem("Faculty"));
const Teachername = Faculty?.TeacherName;
if (!Teachername) {
  setAssignmentList([]);
  return;
}
const filteredAssignments = result.assignment.filter(
  (item) => item.teacherName === Teachername
);
console.log(filteredAssignments)
setAssignmentList(filteredAssignments);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-32 left-10 text-5xl animate-float">📝</div>
        <div className="absolute top-52 right-20 text-6xl animate-float-delayed">
          📚
        </div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">
          ✍️
        </div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">
          📖
        </div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">
          ⏰
        </div>
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 mb-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Manage Assignments
                </h1>
                <p className="text-blue-200">
                  Create, edit and manage student assignments
                </p>
              </div>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New
            </button>
          </div>
        </div>

        {showForm ? (
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-6 md:p-8 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Create New Assignment
              </h2>
              <button
                onClick={handleCancel}
                className="text-blue-200 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-blue-200 text-sm mb-2 block">
                      Topic *
                    </label>
                    <input
                      type="text"
                      name="Topic"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                      placeholder="Enter assignment topic"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-blue-200 text-sm mb-2 block">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="Subject"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                      placeholder="Enter Subject name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-blue-200 text-sm mb-2 block">
                      Teacher Name
                    </label>
                    <input
                      type="text"
                      name="TeacherName"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                      placeholder="Enter Teacher name"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-blue-200 text-sm mb-2 block">
                      Graduation year
                    </label>
                    <select
                      name="Year"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                      required
                    >
                      <option value="" disabled selected>
                        Select year
                      </option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-blue-200 text-sm mb-2 block">
                      Assigned Date
                    </label>
                    <input
                      type="date"
                      name="AssignedDate"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="text-blue-200 text-sm mb-2 block">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      name="DueDate"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-blue-200 text-sm">Questions</label>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 hover:bg-white/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-3">
                    {questions.map((question, index) => (
                      <div key={index} className="flex gap-3">
                        <textarea
                          value={question}
                          onChange={(e) =>
                            handleQuestionChange(index, e.target.value)
                          }
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 min-h-[80px]"
                          placeholder={`Question ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="bg-red-500/20 text-red-300 px-3 rounded-xl hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Create Assignment
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-white/10 text-white px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignmentList.map((assignment) => {
              const daysLeft = calculateDaysLeft(assignment.dueDate);

              return (
                <div
                  key={assignment._id}
                  className={`bg-gradient-to-br ${getCardColor(daysLeft)} rounded-3xl p-6 border border-white/10 hover:scale-105 hover:border-white/20 transition-all duration-300`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-bold mb-2">
                        {assignment.topic}
                      </h3>
                      <p className="text-blue-200 text-sm">
                        {assignment.subject}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${getBadgeColor(daysLeft)}`}
                    >
                      {daysLeft < 0 ? "Overdue" : `${daysLeft}d left`}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-blue-100">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {assignment.teacherName}
                    </div>
                    <div className="flex items-center text-sm text-blue-100">
                      <Calendar className="w-4 h-4 mr-2" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-blue-100">
                      Questions: {assignment.questions}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-2.5 rounded-full font-semibold text-sm border border-white/20 hover:bg-white/20 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="flex items-center justify-center bg-red-500/20 text-red-300 px-4 py-2.5 rounded-full font-semibold text-sm border border-red-400/30 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
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
