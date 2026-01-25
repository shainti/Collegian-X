const { default: mongoose } = require("mongoose");
const AssignmentModel = require("../models/Assignment.model");


exports.Assignment = async (req, res) => {
  try {
    const { topic, subject, teacherName,year, assignedDate, dueDate, questions } = req.body;

    const assignment = await AssignmentModel.create({
      topic,
      subject,
      teacherName,
      year,
      assignedDate,
      dueDate,
      questions,
    });

    res.status(201).json({
      assignment,
      message: "Assignment created",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create assignment",
      error: error.message,
    });
  }
};


exports.GetAssignment = async (req, res) =>{
     try {
    const assignment = await AssignmentModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      assignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }

}
