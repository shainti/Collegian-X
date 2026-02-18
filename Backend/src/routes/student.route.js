const express = require('express')
const studentRoutes = express.Router();
const StudentController = require('../Controller/student.controller');
const { Leaveupload, uploadToCloudinary } = require("../middleware/Multer.config")

// ✅ ADDED: Cloudinary middleware for leave certificates
const handleLeaveCloudinaryUpload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next(); // no files, skip

    const uploadPromises = req.files.map(file =>
      uploadToCloudinary(file.buffer, {
        folder: "leave-certificates",
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
      })
    );

    const results = await Promise.all(uploadPromises);
    req.cloudinaryUrls = results.map(result => result.secure_url); // ✅ attach URLs to req

    next();
  } catch (error) {
    res.status(500).json({ error: "Cloudinary upload failed", details: error.message });
  }
};

studentRoutes.get('/assignment', StudentController.GetStudentAssignment)
studentRoutes.get('/viewtimetable', StudentController.viewtimetable);
studentRoutes.get('/Attendance/:id', StudentController.GetStudentAttendance);
studentRoutes.post('/generate-plan', StudentController.generateplan);
studentRoutes.post(
  "/leave/submit",
  Leaveupload.array('certificates', 5),
  handleLeaveCloudinaryUpload, // ✅ ADDED
  StudentController.submitleaves
);
studentRoutes.get("/leave/history", StudentController.getleavehistory);
module.exports = studentRoutes;