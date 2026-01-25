const { default: mongoose } = require("mongoose");
const AssignmentModel = require("../models/Assignment.model");

exports.GetStudentAssignment = async (req, res) => {
     try {
      //  const student = localStorage.getItem('Student')
      //  console.log(student);
    const assignment = await AssignmentModel.findById(student.Semester);
        res.status(200).json({
          assignment,
        });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }

}