const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    leaveType: {
      type: String,
      required: true,
      enum: ["sick", "medical", "personal", "family", "other"],
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },
     approvedBy: {
      type: String,
      trim: true,
    },
     rejectedBy: {
      type: String,
      trim: true,
    },
    certificates: {
      type: [String], // file paths
      default: [],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);
const Leavemodel = mongoose.model("Leave", leaveSchema);
module.exports = Leavemodel;
