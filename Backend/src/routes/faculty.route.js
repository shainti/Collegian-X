const express = require("express");
const FacultyRouter = express.Router();
const FacultyController = require("../Controller/faculty.controller");
const { upload, Leaveupload, uploadToCloudinary } = require("../middleware/Multer.config");

// ==================== CLOUDINARY MIDDLEWARE ====================
// This middleware uploads file to Cloudinary after multer processes it
const handleCloudinaryUpload = (folder) => async (req, res, next) => {
  try {
    if (!req.file) return next();

    // Use original filename as public_id so download has correct name
    const originalName = req.file.originalname.replace(/\.[^/.]+$/, ""); // remove extension

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: folder,
      resource_type: "raw",
      use_filename: true,                // ✅ use the original filename
      unique_filename: true,             // ✅ add unique suffix to avoid conflicts
    });

    req.cloudinaryResult = result;
    req.file.cloudinaryUrl = result.secure_url;
    req.file.cloudinaryPublicId = result.public_id;

    next();
  } catch (error) {
    res.status(500).json({ error: "Cloudinary upload failed", details: error.message });
  }
};

// ==================== ASSIGNMENT ROUTES ====================
FacultyRouter.post(
  "/assignment",
  upload.single("assignmentFile"),
  handleCloudinaryUpload("assignments"),
  FacultyController.Assignment
);

FacultyRouter.get("/assignment", FacultyController.GetAssignment);

FacultyRouter.put(
  "/assignment/:Id",
  upload.single("assignmentFile"),
  handleCloudinaryUpload("assignments"),
  FacultyController.putassignment
);

FacultyRouter.get("/editassignment/:Id", FacultyController.editViewassignment);
FacultyRouter.delete("/Deleteassignment/:Id", FacultyController.Deleteassignment);

// ==================== STUDENT & ATTENDANCE ROUTES ====================
FacultyRouter.get("/GetStudent", FacultyController.GetStudent);
FacultyRouter.post("/SubmitAttendance", FacultyController.Submitattendance);
FacultyRouter.get("/GetPreviousAttendance", FacultyController.getPreviousAttendance);

// ==================== LEAVE ROUTES ====================
FacultyRouter.get("/Updateleave/applications", FacultyController.GetLeave);
FacultyRouter.get("/Updateleave/statistics", FacultyController.GetLeaveStatic);
FacultyRouter.put("/Updateleave/approve/:id", FacultyController.Approveleave);
FacultyRouter.put("/Updateleave/Rejected/:id", FacultyController.Rejectedleave);

module.exports = FacultyRouter;