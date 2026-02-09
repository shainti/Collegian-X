const express = require("express");
const FacultyRouter = express.Router();
const FacultyController = require("../Controller/faculty.controller");
const upload = require("../middleware/Multer.config");

FacultyRouter.post(
  "/assignment",
  upload.single("assignmentFile"),
  FacultyController.Assignment,
);
FacultyRouter.get("/assignment", FacultyController.GetAssignment);
FacultyRouter.put(
  "/assignment/:Id", 
  upload.single("assignmentFile"),  // ADD THIS
  FacultyController.putassignment
);
FacultyRouter.get("/editassignment/:Id", FacultyController.editViewassignment);
FacultyRouter.put("/assignment/:Id", FacultyController.putassignment);
FacultyRouter.get("/Deleteassignment/:Id", FacultyController.Deleteassignment);
FacultyRouter.get("/GetStudent", FacultyController.GetStudent);
FacultyRouter.post("/SubmitAttendance", FacultyController.Submitattendance);
FacultyRouter.get(
  "/GetPreviousAttendance",
  FacultyController.getPreviousAttendance,
);
// FacultyRouter.get('/GetStudentAttendance/:studentId',FacultyController.Getattendance);
// FacultyRouter.get('/GetMonthlyReport',FacultyController.GetReport);
// FacultyRouter.get('/GetLowAttendance',FacultyController.Getlowattendance);

module.exports = FacultyRouter;
