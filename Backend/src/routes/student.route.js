const express = require('express')
const studentRoutes = express.Router();
const StudentController = require('../Controller/student.controller');
const { Leaveupload } = require("../middleware/Multer.config")

studentRoutes.get('/assignment', StudentController.GetStudentAssignment)
studentRoutes.get('/viewtimetable',StudentController.viewtimetable);
studentRoutes.get('/Attendance/:id', StudentController.GetStudentAttendance);
studentRoutes.post('/generate-plan',StudentController.generateplan);
studentRoutes.post(
  "/leave/submit",
  Leaveupload.array('certificates', 5), // ✅ Use Leaveupload for leave certificates
  StudentController.submitleaves
);
module.exports = studentRoutes; 