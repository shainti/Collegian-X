const express = require('express')
const studentRoutes = express.Router();
const StudentConroller = require('../Controller/student.controller')

studentRoutes.get('/assignment', StudentConroller.GetStudentAssignment)
studentRoutes.get('/viewtimetable',StudentConroller.viewtimetable);
studentRoutes.get('/Attendance/:id', StudentConroller.GetStudentAttendance);

module.exports = studentRoutes; 