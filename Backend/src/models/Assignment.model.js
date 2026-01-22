const mongoose = require("mongoose");

const Assignmentschema = new mongoose.Schema(
   {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    teacherName: {
       type: String,
      required: true,
      trim: true,
    },
    year: {
       type: String,
      required: true,
      trim: true,
    },
    assignedDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    questions: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);
  const AssignmentModel = mongoose.model('assignments', Assignmentschema,'assignments')
  module.exports = AssignmentModel; 
