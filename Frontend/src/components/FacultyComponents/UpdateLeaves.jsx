import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  FileText, 
  User,
  Filter,
  TrendingUp,
  Paperclip,
  X
} from 'lucide-react';

// Memoized Statistics Card Component
const StatCard = memo(({ icon: Icon, label, value, color, delay }) => (
  <div 
    className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-xl ${color} shadow-lg`}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-100">{value}</p>
      </div>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

// Memoized Status Badge
const StatusBadge = memo(({ status }) => {
  const configs = {
    pending: { bg: 'bg-amber-500/20', text: 'text-amber-300', label: 'Pending' },
    approved: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'Approved' },
    rejected: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Rejected' }
  };

  const config = configs[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

// Memoized Leave Application Card
const LeaveCard = memo(({ leave, onApprove, onReject }) => {
  const startDate = useMemo(() => 
    new Date(leave.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    [leave.startDate]
  );
  
  const endDate = useMemo(() => 
    new Date(leave.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    [leave.endDate]
  );
  
  const appliedDate = useMemo(() => 
    new Date(leave.appliedDate).toLocaleDateString('en-IN'),
    [leave.appliedDate]
  );

  const borderColor = useMemo(() => {
    if (leave.status === 'pending') return 'border-amber-500';
    if (leave.status === 'approved') return 'border-emerald-500';
    return 'border-red-500';
  }, [leave.status]);

  const bgGradient = useMemo(() => {
    if (leave.status === 'pending') return 'from-amber-900/10 to-amber-800/5';
    if (leave.status === 'approved') return 'from-emerald-900/10 to-emerald-800/5';
    return 'from-red-900/10 to-red-800/5';
  }, [leave.status]);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} backdrop-blur-sm border-l-4 ${borderColor} rounded-xl p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl group`}>
      {/* Status indicator line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${leave.status === 'pending' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : leave.status === 'approved' ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <User className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{leave.studentName}</h3>
             <p className="text-sm text-slate-400">Year: {leave.Year}</p>
             <p className="text-sm text-slate-400">Roll No: {leave.CollegeRollno}</p>
          </div>
        </div>
        <StatusBadge status={leave.status} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Leave Type</p>
          <p className="text-sm font-semibold text-slate-200 capitalize">{leave.leaveType} Leave</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Duration</p>
          <p className="text-sm font-semibold text-slate-200">{leave.numberOfDays} day{leave.numberOfDays > 1 ? 's' : ''}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider">From</p>
          <p className="text-sm font-semibold text-slate-200">{startDate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider">To</p>
          <p className="text-sm font-semibold text-slate-200">{endDate}</p>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-slate-900/40 rounded-lg p-4 mb-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Reason</p>
        <p className="text-sm text-slate-300 leading-relaxed">{leave.reason}</p>
      </div>

      {/* Attachments */}
      {leave.attachments?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {leave.attachments.map((file, idx) => (
            <a
              key={idx}
              href={`http://localhost:3000/${file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-xs text-blue-300 transition-all duration-200"
            >
              <Paperclip className="w-3 h-3" />
              Certificate {idx + 1}
            </a>
          ))}
        </div>
      )}

      {/* Action Buttons or Status Info */}
      {leave.status === 'pending' ? (
        <div className="flex gap-3 pt-4 border-t border-slate-700/50">
          <button
            onClick={() => onApprove(leave.id)}
            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => onReject(leave.id)}
            className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      ) : leave.status === 'approved' ? (
        <div className="pt-4 border-t border-slate-700/50">
          <p className="text-sm text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approved by {leave.approvedBy || 'Faculty'} 
            {leave.approvedDate && ` on ${new Date(leave.approvedDate).toLocaleDateString('en-IN')}`}
          </p>
        </div>
      ) : (
        <div className="pt-4 border-t border-slate-700/50">
          <p className="text-sm text-red-400 flex items-start gap-2">
            <XCircle className="w-4 h-4 mt-0.5" />
            <span>Rejected by {leave.rejectedBy || 'Faculty'}: {leave.rejectionReason || 'No reason provided'}</span>
          </p>
        </div>
      )}
    </div>
  );
});

LeaveCard.displayName = 'LeaveCard';

// Reject Modal Component
const RejectModal = memo(({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = useCallback(() => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    onConfirm(reason);
    setReason('');
  }, [reason, onConfirm]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-[slideUp_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-100">Reject Leave Application</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Reason for Rejection *
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for rejecting this leave application..."
            rows={4}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
});

RejectModal.displayName = 'RejectModal';

// Main Component
const TeacherLeaveApproval = () => {
  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [currentRejectId, setCurrentRejectId] = useState(null);

  // Helper function to calculate days between dates
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Load statistics
  const loadStatistics = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/Faculty/Updateleave/statistics', {
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      // Handle response structure { data: {...} }
        setStatistics(data);
    } catch (error) {
      console.error('Statistics error:', error);
    }
  }, []);

  // Load applications
  const loadApplications = useCallback(async (status) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/Faculty/Updateleave/applications?status=${status}`,
        {
          credentials: 'include',
        }
      );
      const result = await response.json();
      // Handle response structure { data: [...] }
      const leaveData = result.data ? result.data : (Array.isArray(result) ? result : []);
      
      // Transform data to match UI expectations
      const transformedData = leaveData.map(leave => ({
        id: leave._id,
        studentId: leave.studentId,
        studentName: leave.FullName,
        CollegeRollno:leave.CollegeRollNo,
        Year:leave.Semester,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
        status: leave.status,
        appliedDate: leave.appliedDate || leave.createdAt,
        numberOfDays: calculateDays(leave.startDate, leave.endDate),
        attachments: leave.certificates || [],
        approvedBy: leave.approvedBy,
        approvedDate: leave.approvedDate,
        rejectedBy: leave.rejectedBy,
        rejectionReason: leave.rejectionReason,
      }));
      
      setApplications(transformedData);
    } catch (error) {
      console.error('Load applications error:', error);
      setApplications([]);
    }
  }, []);

  // Approve leave
  const handleApprove = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to approve this leave application?')) return;

    try {
      const facultyData = JSON.parse(localStorage.getItem('Faculty') || '{}');
      
      const response = await fetch(`http://localhost:3000/api/Faculty/leave/approve/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          facultyId: facultyData.id,
          facultyName: facultyData.FullName || 'Faculty'
        })
      });

      const result = await response.json();

      if (response.ok) {
        loadApplications(statusFilter);
        loadStatistics();
        alert('Leave application approved successfully!');
      } else {
        alert('Error: ' + (result.message || 'Failed to approve'));
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve leave');
    }
  }, [statusFilter, loadApplications, loadStatistics]);

  // Open reject modal
  const openRejectModal = useCallback((id) => {
    setCurrentRejectId(id);
    setRejectModalOpen(true);
  }, []);

  // Confirm rejection
  const confirmReject = useCallback(async (reason) => {
    try {
      const facultyData = JSON.parse(localStorage.getItem('Faculty') || '{}');
      
      const response = await fetch(`http://localhost:3000/api/Faculty/leave/reject/${currentRejectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          facultyId: facultyData.id,
          facultyName: facultyData.FullName || 'Faculty',
          rejectionReason: reason
        })
      });

      const result = await response.json();

      if (response.ok) {
        setRejectModalOpen(false);
        setCurrentRejectId(null);
        loadApplications(statusFilter);
        loadStatistics();
        alert('Leave application rejected.');
      } else {
        alert('Error: ' + (result.message || 'Failed to reject'));
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Failed to reject leave');
    }
  }, [currentRejectId, statusFilter, loadApplications, loadStatistics]);

  // Filter change
  const handleFilterChange = useCallback((e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    loadApplications(newStatus);
  }, [loadApplications]);

  // Initial load
  useEffect(() => {
    loadStatistics();
    loadApplications(statusFilter);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24">

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={Clock} 
            label="Pending Approvals" 
            value={statistics.pending} 
            color="bg-gradient-to-br from-amber-500 to-yellow-500"
            delay={0}
          />
          <StatCard 
            icon={CheckCircle} 
            label="Approved" 
            value={statistics.approved} 
            color="bg-gradient-to-br from-emerald-500 to-green-500"
            delay={100}
          />
          <StatCard 
            icon={XCircle} 
            label="Rejected" 
            value={statistics.rejected} 
            color="bg-gradient-to-br from-red-500 to-rose-500"
            delay={200}
          />
        </div>

        {/* Filter Section */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-400" />
            <label className="text-sm font-semibold text-slate-300">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={handleFilterChange}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            >
              <option value="pending">Pending</option>
              <option value="all">All Applications</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Leave Applications
          </h2>

          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <FileText className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No {statusFilter === 'all' ? '' : statusFilter} applications</p>
              </div>
            ) : (
              applications.map(app => (
                <LeaveCard 
                  key={app.id} 
                  leave={app} 
                  onApprove={handleApprove}
                  onReject={openRejectModal}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <RejectModal 
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={confirmReject}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherLeaveApproval;