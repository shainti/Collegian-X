import React, { useState } from 'react';
import { Upload, Send, AlertCircle, FileText, X as XIcon } from 'lucide-react';

export default function ComplaintsForm() {
    const student = JSON.parse(localStorage.getItem("Student")) || null;
  const [formData, setFormData] = useState({
    studentName: student.FullName,
    studentId: student.id,
    email: student.email,
    category: '',
    title: '',
    description: '',
    priority: 'medium'
  });
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'Academic Issues',
    'Hostel/Accommodation',
    'Faculty/Staff',
    'Infrastructure',
    'Harassment/Bullying',
    'Administration',
    'Library',
    'Canteen/Food Services',
    'Safety & Security',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = 'Name is required';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.title.trim()) newErrors.title = 'Complaint title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Complaint submitted:', { ...formData, files });
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          studentName: '',
          studentId: '',
          email: '',
          category: '',
          title: '',
          description: '',
          priority: 'medium'
        });
        setFiles([]);
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#152238] to-[#1a2744] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <svg width="400" height="400" viewBox="0 0 200 200" className="animate-spin-slow">
              <rect x="88" y="25" width="24" height="150" rx="12" fill="#4FC3F7" transform="rotate(45 100 100)"/>
              <rect x="88" y="25" width="24" height="150" rx="12" fill="#4FC3F7" transform="rotate(-45 100 100)"/>
            </svg>
          </div>
          <h1 className="text-5xl font-black mb-3 tracking-tight relative z-10 pt-10">
            <span className="text-white">Collegian </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">X</span>
          </h1>
          <p className="text-xl text-slate-300 font-medium">Student Complaints Portal</p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Main Form Card */}
        <div className="bg-gradient-to-br from-[#1e3a5f]/40 to-[#2a4a6f]/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50">
          {submitted && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 flex items-center gap-3 animate-slide-down">
              <AlertCircle size={24} />
              <span className="font-semibold text-lg">Complaint submitted successfully! We'll review it shortly.</span>
            </div>
          )}

          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 pb-3 border-b-2 border-cyan-500/30">
                  <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${errors.studentName ? 'border-red-400' : 'border-slate-600'} bg-slate-800/50 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all outline-none text-white font-medium placeholder-slate-500`}
                      placeholder="Enter your full name"
                    />
                    {errors.studentName && <p className="text-red-400 text-sm mt-1 font-medium">{errors.studentName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Student ID *
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${errors.studentId ? 'border-red-400' : 'border-slate-600'} bg-slate-800/50 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all outline-none text-white font-medium placeholder-slate-500`}
                      placeholder="e.g., CX2024001"
                    />
                    {errors.studentId && <p className="text-red-400 text-sm mt-1 font-medium">{errors.studentId}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-400' : 'border-slate-600'} bg-slate-800/50 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all outline-none text-white font-medium placeholder-slate-500`}
                    placeholder="your.email@college.edu"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1 font-medium">{errors.email}</p>}
                </div>
              </div>

              {/* Complaint Details Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 pb-3 border-b-2 border-cyan-500/30">
                  <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                  Complaint Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${errors.category ? 'border-red-400' : 'border-slate-600'} bg-slate-800/50 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all outline-none text-white font-medium`}
                    >
                      <option value="" className="bg-slate-800">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-400 text-sm mt-1 font-medium">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Priority Level
                    </label>
                    <div className="flex gap-3">
                      {['low', 'medium', 'high'].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, priority: level }))}
                          className={`flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                            formData.priority === level
                              ? level === 'low' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                              : level === 'medium' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                              : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30'
                              : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 border border-slate-600'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Complaint Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.title ? 'border-red-400' : 'border-slate-600'} bg-slate-800/50 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all outline-none text-white font-medium placeholder-slate-500`}
                    placeholder="Brief summary of your complaint"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1 font-medium">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.description ? 'border-red-400' : 'border-slate-600'} bg-slate-800/50 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all outline-none text-white font-medium resize-none placeholder-slate-500`}
                    placeholder="Describe your complaint in detail. Include dates, times, locations, and any relevant information..."
                  />
                  {errors.description && <p className="text-red-400 text-sm mt-1 font-medium">{errors.description}</p>}
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 pb-3 border-b-2 border-cyan-500/30">
                  <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                  Supporting Documents
                </h2>

                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-cyan-400 transition-all bg-slate-800/30 hover:bg-slate-800/50">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload size={48} className="mx-auto text-cyan-400 mb-3" />
                    <p className="text-white font-semibold mb-1">
                      Click to upload files or drag and drop
                    </p>
                    <p className="text-sm text-slate-400">
                      Images, PDFs, or documents (Max 10MB each)
                    </p>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-800/50 border border-slate-600 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <FileText size={24} className="text-cyan-400" />
                          <div>
                            <p className="font-semibold text-white">{file.name}</p>
                            <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <XIcon size={20} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-3 text-lg group"
                >
                  <span>Submit Complaint</span>
                  <Send size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Your complaint will be reviewed within <span className="font-bold text-cyan-400">24-48 hours</span>. 
            You'll receive updates via email.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}