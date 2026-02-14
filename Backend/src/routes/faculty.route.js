const express = require("express");
const FacultyRouter = express.Router();
const FacultyController = require("../Controller/faculty.controller");
const { upload } = require("../middleware/Multer.config");

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
FacultyRouter.delete("/Deleteassignment/:Id", FacultyController.Deleteassignment);
FacultyRouter.get("/GetStudent", FacultyController.GetStudent);
FacultyRouter.post("/SubmitAttendance", FacultyController.Submitattendance);
FacultyRouter.get('/Updateleave/applications', FacultyController.GetLeave);
FacultyRouter.get('/Updateleave/statistics', FacultyController.GetLeaveStatic);
FacultyRouter.put('/Updateleave/approve/:id', FacultyController.Approveleave);
FacultyRouter.get(
  "/GetPreviousAttendance",
  FacultyController.getPreviousAttendance,
);
module.exports = FacultyRouter;
