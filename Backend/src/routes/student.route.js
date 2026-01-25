const express = require('express')
const studentRoutes = express.Router();
const StudentConroller = require('../Controller/student.controller')

studentRoutes.get('/assignment', StudentConroller.GetStudentAssignment)

module.exports = studentRoutes; 