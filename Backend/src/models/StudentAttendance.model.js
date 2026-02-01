const mongoose = require('mongoose');

// Student Attendance Schema
const studentAttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
facultyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Faculty",
  required: true
},
  year: {
    type: String,
    required: true,
    enum: ['1', '2', '3']
  },
  
  subject: {
    type: String,
    required: true,
    trim: true
  },
  
  month: {
    type: String,
    required: true,
    match: /^\d{4}-(0[1-9]|1[0-2])$/
  },
  
  totalClasses: {
    type: Number,
    required: true,
    min: 1
  },
  
  attendedClasses: {
    type: Number,
    required: true,
    min: 0
  },
  
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate: one record per student-subject-month
studentAttendanceSchema.index(
  { studentId: 1, subject: 1, month: 1 }, 
  { unique: true }
);

// // Validation
// studentAttendanceSchema.pre('save', function(next) {
//   if (this.attendedClasses > this.totalClasses) {
//     next(new Error('Attended classes cannot exceed total classes'));
//   } else {
//     next();
//   }
// });

const StudentAttendance = mongoose.model('StudentAttendance', studentAttendanceSchema);

module.exports = StudentAttendance;