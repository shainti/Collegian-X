import React, { useState, useCallback, useMemo, memo } from 'react';
import { Upload, Calendar, FileText, CheckCircle, XCircle, Clock, Paperclip, X } from 'lucide-react';

// Memoized file preview component
const FilePreview = memo(({ file, onRemove, index }) => {
  const fileIcon = file.type.includes('pdf') ? '📄' : '🖼️';
  const fileSize = (file.size / 1024).toFixed(2);

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm p-3 rounded-lg border border-slate-600/30 group hover:border-emerald-500/50 transition-all duration-300">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{fileIcon}</span>
        <div>
          <div className="text-sm font-medium text-slate-200">{file.name}</div>
          <div className="text-xs text-slate-400">{fileSize} KB</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/20 rounded-lg"
        aria-label="Remove file"
      >
        <X className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );
});

FilePreview.displayName = 'FilePreview';

// Memoized status badge component
const StatusBadge = memo(({ status }) => {
  const statusConfig = {
    pending: { color: 'amber', icon: Clock, label: 'Pending' },
    approved: { color: 'emerald', icon: CheckCircle, label: 'Approved' },
    rejected: { color: 'red', icon: XCircle, label: 'Rejected' }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
      ${status === 'pending' ? 'bg-amber-500/20 text-amber-300' : ''}
      ${status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : ''}
      ${status === 'rejected' ? 'bg-red-500/20 text-red-300' : ''}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

// Memoized leave history card
const LeaveHistoryCard = memo(({ leave }) => {
  const startDate = new Date(leave.startDate).toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
  const endDate = new Date(leave.endDate).toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

  return (
    <div className={`relative overflow-hidden rounded-xl p-5 border-l-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
      ${leave.status === 'pending' ? 'bg-gradient-to-br from-amber-900/20 to-amber-800/10 border-amber-500' : ''}
      ${leave.status === 'approved' ? 'bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-500' : ''}
      ${leave.status === 'rejected' ? 'bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-100 capitalize">
            {leave.leaveType} Leave
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Applied on {new Date(leave.appliedDate).toLocaleDateString('en-IN')}
          </p>
        </div>
        <StatusBadge status={leave.status} />
      </div>

      <div className="space-y-2 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{startDate} → {endDate} ({leave.numberOfDays} day{leave.numberOfDays > 1 ? 's' : ''})</span>
        </div>
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
          <span className="flex-1">{leave.reason}</span>
        </div>
        
        {leave.approvedBy && (
          <p className="text-xs text-emerald-400 mt-3">
            ✓ Approved by {leave.approvedBy}
          </p>
        )}
        
        {leave.rejectionReason && (
          <p className="text-xs text-red-400 mt-3">
            ✗ {leave.rejectionReason}
          </p>
        )}
        
        {leave.attachments?.length > 0 && (
          <a 
            href={leave.attachments[0]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-2"
          >
            <Paperclip className="w-3 h-3" />
            View Certificate
          </a>
        )}
      </div>
    </div>
  );
});

LeaveHistoryCard.displayName = 'LeaveHistoryCard';

// Main Component
const LeaveApplication = () => {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Get today's date for min date validation
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Memoized file validation
  const validateFile = useCallback((file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      alert(`"${file.name}" is not a supported format. Please upload PDF, JPG, or PNG.`);
      return false;
    }

    if (file.size > maxSize) {
      alert(`"${file.name}" exceeds 5MB limit.`);
      return false;
    }

    return true;
  }, []);

  // Handle file selection
  const handleFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter(validateFile);
    setUploadedFiles(prev => [...prev, ...validFiles]);
  }, [validateFile]);

  // Remove file
  const removeFile = useCallback((index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  // Form change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Submit form
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('studentId', sessionStorage.getItem('studentId') || 'STUDENT_ID');
    uploadedFiles.forEach(file => data.append('certificates', file));

    try {
      const response = await fetch('/api/leave/submit', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
        setUploadedFiles([]);
        loadLeaveHistory();
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit leave application');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, uploadedFiles]);

  // Load leave history
  const loadLeaveHistory = useCallback(async () => {
    try {
      const studentId = sessionStorage.getItem('studentId') || 'STUDENT_ID';
      const response = await fetch(`/api/leave/history?studentId=${studentId}`);
      const data = await response.json();
      setLeaveHistory(data);
    } catch (error) {
      console.error('Load history error:', error);
    }
  }, []);

  // Load history on mount
  React.useEffect(() => {
    loadLeaveHistory();
  }, [loadLeaveHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-25">

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center gap-3 backdrop-blur-sm animate-[slideDown_0.3s_ease-out]">
            <CheckCircle className="w-5 h-5" />
            Leave application submitted successfully!
          </div>
        )}

        {/* Application Form */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            Apply for Leave
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type */}
            <div>
              <label htmlFor="leaveType" className="block text-sm font-semibold text-slate-300 mb-2">
                Leave Type *
              </label>
              <select
                id="leaveType"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              >
                <option value="">Select leave type</option>
                <option value="sick">Sick Leave</option>
                <option value="medical">Medical Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="family">Family Emergency</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-slate-300 mb-2">
                  From Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-slate-300 mb-2">
                  To Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || today}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-semibold text-slate-300 mb-2">
                Reason for Leave *
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Please provide a detailed reason for your leave..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Attach Certificate (PDF, JPG, PNG - Max 5MB)
              </label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                  ${isDragging 
                    ? 'border-emerald-500 bg-emerald-500/10 scale-105' 
                    : 'border-slate-600 bg-slate-800/30 hover:border-emerald-500/50 hover:bg-slate-800/50'}`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-3 transition-colors ${isDragging ? 'text-emerald-400' : 'text-slate-500'}`} />
                <p className="text-slate-300 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-500">Medical certificate, supporting documents</p>
              </div>

              <input
                type="file"
                id="fileInput"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />

              {/* File Previews */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <FilePreview key={index} file={file} onRemove={removeFile} index={index} />
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Leave Application'}
            </button>
          </form>
        </div>

        {/* Leave History */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" />
            Leave History
          </h2>

          <div className="space-y-4">
            {leaveHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No leave applications yet</p>
              </div>
            ) : (
              leaveHistory.map(leave => (
                <LeaveHistoryCard key={leave.id} leave={leave} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;