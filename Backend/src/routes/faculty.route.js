const express = require('express')
const FacultyRouter = express.Router();
const FacultyController = require('../Controller/faculty.controller')

FacultyRouter.post('/Assignment',FacultyController.Assignment)
FacultyRouter.get("/assignment", FacultyController.GetAssignment);



module.exports = FacultyRouter; 