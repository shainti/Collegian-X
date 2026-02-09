import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
  Calendar,
  BookOpen,
  Loader2,
} from "lucide-react";

const faculty = JSON.parse(localStorage.getItem('Faculty'));
console.log(faculty.TeacherName);
export default function FacultyAssignmentManager() {
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState(["", ""]);
  const [assignmentList, setAssignmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    subject: "",
    teacherName: faculty.TeacherName,
    year: "",
    assignedDate: "",
    dueDate: "",
  });

  const [editingId, setEditingId] = useState(null);

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
    setEditingId(null);

    setFormData({
      topic: "",
      subject: "",
      teacherName: "",
      year: "",
      assignedDate: "",
      dueDate: "",
    });

    setQuestions(["", ""]);
    setShowForm(true);
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/Faculty/editassignment/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const result = await response.json();
      const assignment = result.assignment;

      setFormData({
        topic: assignment.topic || "",
        subject: assignment.subject || "",
        teacherName: faculty.TeacherName || "",
        year: assignment.year || "",
        assignedDate: assignment.assignedDate
          ? assignment.assignedDate.split("T")[0]
          : "",
        dueDate: assignment.dueDate ? assignment.dueDate.split("T")[0] : "",
      });

      setQuestions(assignment.questions || []);
      setEditingId(assignment._id);
      setShowForm(true);
    } catch (error) {
      console.error("Edit fetch failed", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/Faculty/Deleteassignment/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {}
    console.log("Delete Assignment ID:", id);
  };



  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      await fetch(
        editingId
          ? `http://localhost:3000/api/Faculty/assignment/${editingId}`
          : "http://localhost:3000/api/Faculty/assignment",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            questions: questions.filter((q) => q.trim() !== ""),
          }),
        },
      );

      setShowForm(false);
      setEditingId(null);
      fetchAssignments();
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);

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

      const result = await getresponse.json();

      const Faculty = JSON.parse(localStorage.getItem("Faculty"));
      const Teachername = Faculty?.TeacherName;

      if (!Teachername) {
        setAssignmentList([]);
        return;
      }

      const filteredAssignments = result.assignment.filter(
        (item) => item.teacherName === Teachername,
      );

      setAssignmentList(filteredAssignments);
    } catch (error) {
      console.error("Error fetching assignments", error);
    } finally {
      setLoading(false);
    }
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
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-4 sm:p-6 mb-6 border border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Manage Assignments
                </h1>
                <p className="text-sm sm:text-base text-blue-200">
                  Create, edit and manage student assignments
                </p>
              </div>
            </div>
            <button
              onClick={handleAddNew}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add New
            </button>
          </div>
        </div>

        {showForm ? (
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Create New Assignment
              </h2>
              <button
                onClick={handleCancel}
                className="text-blue-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
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
                      value={formData.topic}
                      onChange={(e) =>
                        setFormData({ ...formData, topic: e.target.value })
                      }
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
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
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
                      value={faculty.TeacherName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teacherName: e.target.value,
                        })
                      }
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
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
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
                      value={formData.assignedDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assignedDate: e.target.value,
                        })
                      }
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
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <label className="text-blue-200 text-sm">Questions</label>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 hover:bg-white/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-3">
                    {questions.map((question, index) => (
                      <div key={index} className="flex gap-2 sm:gap-3">
                        <textarea
                          value={question}
                          onChange={(e) =>
                            handleQuestionChange(index, e.target.value)
                          }
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 min-h-[80px] text-sm sm:text-base"
                          placeholder={`Question ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="bg-red-500/20 text-red-300 px-2 sm:px-3 rounded-xl hover:bg-red-500/30 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        {editingId ? "Update Assignment" : "Create Assignment"}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-white/10 text-white px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-white text-base sm:text-lg mt-6 font-semibold">
              Loading assignments...
            </p>
            <p className="text-blue-300 text-xs sm:text-sm mt-2">
              Please wait while we fetch your data
            </p>
          </div>
        ) : assignmentList.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-full p-6 sm:p-8 mb-4 sm:mb-6">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400" />
            </div>
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-2 text-center">
              No Assignments Yet
            </h3>
            <p className="text-blue-300 text-center mb-4 sm:mb-6 text-sm sm:text-base">
              Start creating assignments for your students
            </p>
            <button
              onClick={handleAddNew}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-all text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Create Your First Assignment
            </button>
          </div>
        ) : (
          // Assignment List
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {assignmentList.map((assignment) => {
              const daysLeft = calculateDaysLeft(assignment.dueDate);

              return (
                <div
                  key={assignment._id}
                  className={`bg-gradient-to-br ${getCardColor(daysLeft)} rounded-3xl p-4 sm:p-6 border border-white/10 hover:scale-105 hover:border-white/20 transition-all duration-300`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-2">
                      <h3 className="text-white text-base sm:text-lg font-bold mb-2">
                        {assignment.topic}
                      </h3>
                      <p className="text-blue-200 text-xs sm:text-sm">
                        {assignment.subject}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold border ${getBadgeColor(daysLeft)} whitespace-nowrap flex-shrink-0`}
                    >
                      {daysLeft < 0 ? "Overdue" : `${daysLeft}d left`}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs sm:text-sm text-blue-100">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{assignment.teacherName}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-blue-100">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-100">
                      Questions: {assignment.questions.length}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(assignment._id)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-white/10 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm border border-white/20 hover:bg-white/20 transition-all"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(assignment._id)}
                      className="flex items-center justify-center bg-red-500/20 text-red-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm border border-red-400/30 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
