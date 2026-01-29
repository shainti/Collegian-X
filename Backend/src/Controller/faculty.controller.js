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
exports.editViewassignment = async (req, res) =>{
  const  Id  = req.params.Id
  try {
    const assignment = await AssignmentModel.findById(Id)
    res.status(200).json({
      assignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }

}

exports.putassignment = async (req, res) => {
  const { Id } = req.params;
  const {
    topic,
    subject,
    teacherName,
    year,
    assignedDate,
    dueDate,
    questions,
  } = req.body;

  try {
    const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
      Id,
      {
        topic,
        subject,
        teacherName,
        year,
        assignedDate,
        dueDate,
        questions,
      },
      { new: true } // return updated document
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      assignment: updatedAssignment,
      message: "Assignment updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update assignment" });
  }
};


exports.Deleteassignment = async (req, res) => {
  const { Id } = req.params;
  try {
    const Deleteassignment = await AssignmentModel.findByIdAndDelete(Id);
    if (!Deleteassignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      assignment: Deleteassignment,
      message: "Assignment Delete successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update assignment" });
  }
};


exports.viewtimetable = async (req, res) => {
  
};