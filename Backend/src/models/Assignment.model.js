const mongoose = require("mongoose");

const Assignmentschema = new mongoose.Schema(
  {
    topic: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  assignedDate: {
    type: Date
  },
  dueDate: {
    type: Date,
    required: true
  },
  questions: [{
    type: String
  }],
  fileName: {
    type: String
  },
  filePath: {
    type: String
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  }
}, {
  timestamps: true
});
  const AssignmentModel = mongoose.model('assignments', Assignmentschema,'assignments')
  module.exports = AssignmentModel; 
