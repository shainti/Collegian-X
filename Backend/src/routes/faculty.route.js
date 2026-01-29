const express = require('express')
const FacultyRouter = express.Router();
const FacultyController = require('../Controller/faculty.controller')

FacultyRouter.post('/assignment',FacultyController.Assignment)
FacultyRouter.get("/assignment", FacultyController.GetAssignment);
FacultyRouter.get('/editassignment/:Id', FacultyController.editViewassignment);
FacultyRouter.put('/assignment/:Id', FacultyController.putassignment);
FacultyRouter.get('/Deleteassignment/:Id', FacultyController.Deleteassignment);


module.exports = FacultyRouter; 