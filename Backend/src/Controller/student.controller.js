const { default: mongoose } = require("mongoose");
const AssignmentModel = require("../models/Assignment.model");

exports.GetStudentAssignment = async (req, res) => {
 try {
    const assignment = await AssignmentModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      assignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }

}

exports.viewtimetable = async (req, res) => {
  
};