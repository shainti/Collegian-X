const express = require('express')
const FacultyRouter = express.Router();
const FacultyController = require('../Controller/faculty.controller')

FacultyRouter.post('/assignment',FacultyController.Assignment)
FacultyRouter.get("/assignment", FacultyController.GetAssignment);
FacultyRouter.get('/editassignment/:Id', FacultyController.editViewassignment);
FacultyRouter.put('/assignment/:Id', FacultyController.putassignment);
FacultyRouter.get('/Deleteassignment/:Id', FacultyController.Deleteassignment);
FacultyRouter.get('/GetStudent', FacultyController.GetStudent); 
FacultyRouter.post('/SubmitAttendance',FacultyController.Submitattendance);
// FacultyRouter.get('/GetStudentAttendance/:studentId',FacultyController.Getattendance);
// FacultyRouter.get('/GetMonthlyReport',FacultyController.GetReport);
// FacultyRouter.get('/GetLowAttendance',FacultyController.Getlowattendance);


module.exports = FacultyRouter; 