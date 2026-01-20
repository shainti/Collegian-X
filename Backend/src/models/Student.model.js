const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    Department:{
      type: String,
      requied: true
    },
    Semester:{
      type: String,
      requied: true
    },
    CollegeRollNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    Timestamp: true,
  }
);

const StudentModel = mongoose.model("Student",StudentSchema)

module.exports = StudentModel;