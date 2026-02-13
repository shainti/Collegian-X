const { default: mongoose } = require("mongoose");
const AssignmentModel = require("../models/Assignment.model");
const StudentModel = require('../models/Student.model')
const StudentAttendance = require('../models/StudentAttendance.model')
const fs = require("fs");
const { sendMail } = require('../middleware/Email.confiq')
const Leavemodel = require('../models/Leave.model')

exports.Assignment = async (req, res) => {
  try {
    const {
      topic,
      subject,
      teacherName,
      year,
      assignedDate,
      dueDate,
      questions,
    } = req.body;

    let parsedQuestions = [];

    if (questions) {
      parsedQuestions =
        typeof questions === "string" ? JSON.parse(questions) : questions;
    }

    const assignmentData = {
      topic,
      subject,
      teacherName,
      year,
      assignedDate,
      dueDate,
      questions: parsedQuestions,
    };

    if (req.file) {
      assignmentData.fileName = req.file.originalname;
      assignmentData.filePath = req.file.filename;
      assignmentData.fileSize = req.file.size;
      assignmentData.mimeType = req.file.mimetype;
    }


    const assignment = await AssignmentModel.create(assignmentData);

    const students = await StudentModel.find({ Semester: year }).select("email FullName");

    if (students.length > 0) {
      const emails = students.map((s) => s.email);

      const mailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Assignment Available</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Topic:</strong> ${topic}</p>
            <p><strong>Teacher:</strong> ${teacherName}</p>
            <p><strong>Due Date:</strong> ${new Date(dueDate).toDateString()}</p>
            ${assignment.fileName ? `<p><strong>Attached File:</strong> ${assignment.fileName}</p>` : ''}
          </div>
          <p>Please log in to the student portal to view complete assignment details and download any attached files.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `;

      try {for (const email of emails) {
  await sendMail({
    to: email,
    subject: "New Assignment Available",
    html: mailHTML,
  });
}
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    } else {
      console.log('No students found for year:', year); 
    }

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment: assignment,
      emailsSent: students.length > 0 ? students.length : 0
    });

  } catch (error) {
    console.error('Assignment creation error:', error); 
    
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log('Error deleting file:', err);
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create assignment",
    });
  }
};

exports.putassignment = async (req, res) => {
  const { Id } = req.params;
  const {
    topic,
    subject,
    teacherName,
    year,
    assignedDate,
    dueDate,
    questions,
  } = req.body;

  try {
    let parsedQuestions = questions;
    
    if (typeof questions === "string") {
      try {
        parsedQuestions = JSON.parse(questions);
      } catch (e) {
        console.error("Error parsing questions:", e);
        parsedQuestions = [];
      }
    }

    // Ensure it's an array
    if (!Array.isArray(parsedQuestions)) {
      parsedQuestions = [];
    }

    const updateData = {
      topic,
      subject,
      teacherName,
      year,
      assignedDate,
      dueDate,
      questions: parsedQuestions, // This will be stored as an array in MongoDB
    };

    // If new file uploaded, update file info
    if (req.file) {
      // Get old assignment to delete old file
      const oldAssignment = await AssignmentModel.findById(Id);
      
      // Delete old file if exists
      if (oldAssignment && oldAssignment.filePath) {
        const oldFilePath = `uploads/${oldAssignment.filePath}`;
        fs.unlink(oldFilePath, (err) => {
          if (err) console.log('Error deleting old file:', err);
        });
      }

      // Add new file info
      updateData.fileName = req.file.originalname;
      updateData.filePath = req.file.filename;
      updateData.fileSize = req.file.size;
      updateData.mimeType = req.file.mimetype;
    }

    const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
      Id,
      updateData,
      { new: true } // return updated document
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      assignment: updatedAssignment,
      message: "Assignment updated successfully",
    });
  } catch (error) {
    // Remove uploaded file if update fails
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }
    
    console.error("Update error:", error);
    res.status(500).json({ 
      message: "Failed to update assignment",
      error: error.message 
    });
  }
};


exports.GetAssignment = async (req, res) =>{
     try {
    const assignment = await AssignmentModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      assignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }

}
exports.editViewassignment = async (req, res) =>{
  const  Id  = req.params.Id
  try {
    const assignment = await AssignmentModel.findById(Id)
    res.status(200).json({
      assignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }

}

exports.putassignment = async (req, res) => {
  const { Id } = req.params;
  const {
    topic,
    subject,
    teacherName,
    year,
    assignedDate,
    dueDate,
    questions,
  } = req.body;

  try {
    const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
      Id,
      {
        topic,
        subject,
        teacherName,
        year,
        assignedDate,
        dueDate,
        questions,
      },
      { new: true } // return updated document
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      assignment: updatedAssignment,
      message: "Assignment updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update assignment" });
  }
};


exports.Deleteassignment = async (req, res) => {
  const { Id } = req.params;
  try {
    const Deleteassignment = await AssignmentModel.findByIdAndDelete(Id);
    if (!Deleteassignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      assignment: Deleteassignment,
      message: "Assignment Delete successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update assignment" });
  }
};

exports.GetStudent = async (req, res) => {
  try {
    const { year } = req.query; // Get from query string (?year=1)
    
    if (!year) {
      return res.status(400).json({ 
        message: "Year parameter is required" 
      });
    }
    
    const students = await StudentModel.find({ Semester: year });
    
    if (students.length === 0) {
      return res.status(404).json({ 
        message: "No students found for this year" 
      });
    }
    
    res.status(200).json({
      students: students,
      count: students.length,
      message: "Students found successfully"
    });
    
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      message: "Error fetching students",
      error: error.message
    });
  }
};

exports.Submitattendance= async (req, res)=> {
 try {
    const { studentId, facultyId , year, subject, month, totalClasses, attendedClasses,} = req.body;
    // const facultyId = req.user._id; // From authentication middleware

    if (!studentId || !year || !subject || !month || !totalClasses || attendedClasses === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if attended exceeds total
    if (parseInt(attendedClasses) > parseInt(totalClasses)) {
      return res.status(400).json({
        success: false,
        message: 'Attended classes cannot exceed total classes'
      });
    }

    // Check if attendance already exists for this student-subject-month
    const existingAttendance = await StudentAttendance.findOne({
      studentId,
      subject,
      month
    });

    if (existingAttendance) {
      // Update existing record
      existingAttendance.facultyId = facultyId;
      existingAttendance.year = year;
      existingAttendance.totalClasses = parseInt(totalClasses);
      existingAttendance.attendedClasses = parseInt(attendedClasses);
      existingAttendance.submittedAt = Date.now();
      
      await existingAttendance.save();

      return res.status(200).json({
        success: true,
        message: 'Attendance updated successfully',
        data: existingAttendance
      });
    }

    // Create new attendance record
    const newAttendance = new StudentAttendance({
      studentId,
      facultyId,
      year,
      subject,
      month,
      totalClasses: parseInt(totalClasses),
      attendedClasses: parseInt(attendedClasses),
    });

    await newAttendance.save();

    res.status(201).json({
      success: true,
      message: 'Attendance submitted successfully',
      data: newAttendance
    });

  } catch (error) {
    console.error('Submit attendance error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Attendance already exists for this student and month'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit attendance'
    });
  }
}

exports.getPreviousAttendance = async (req, res) => {
  try {
    const { year, subject, month, facultyId } = req.query;

    // Validate required parameters
    if (!year || !subject || !month || !facultyId) {
      return res.status(400).json({
        success: false,
        message: 'Year, subject, month, and facultyId are required'
      });
    }

    // Fetch attendance records
    const attendanceRecords = await StudentAttendance.find({
      year,
      subject,
      month,
      facultyId
    })
    .populate('studentId', 'FullName CollegeRollNo Email')
    .sort({ studentRollNo: 1 });

    // Format the response
    const formattedRecords = attendanceRecords.map(record => ({
      id: record._id,
      studentId: record.studentId?._id,
      name: record.studentName || record.studentId?.FullName,
      rollNo: record.studentRollNo || record.studentId?.CollegeRollNo,
      subject: record.subject,
      totalClasses: record.totalClasses,
      attendedClasses: record.attendedClasses,
      percentage: record.percentage,
      month: record.month,
      year: record.year,
      submittedAt: record.createdAt
    }));

    return res.status(200).json({
      success: true,
      records: formattedRecords,
      count: formattedRecords.length,
      summary: {
        totalStudents: formattedRecords.length,
        averageAttendance: formattedRecords.length > 0
          ? (formattedRecords.reduce((sum, r) => sum + parseFloat(r.percentage), 0) / formattedRecords.length).toFixed(2)
          : 0,
        below75: formattedRecords.filter(r => parseFloat(r.percentage) < 75).length
      }
    });

  } catch (error) {
    console.error('Error fetching previous attendance:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch previous attendance',
      error: error.message
    });
  }
};

exports.GetLeave = async (req, res) =>{
  try {
    const { status } = req.query;

    let filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    
   const leaves = await Leavemodel
  .find(filter)
  .sort({ appliedDate: -1 })
  .populate("studentId", "FullName CollegeRollNo Semester email")
  .lean();

  const formattedLeaves = leaves.map(leave => ({
  _id: leave._id,
  leaveType: leave.leaveType,
  startDate: leave.startDate,
  endDate: leave.endDate,
  reason: leave.reason,
  status: leave.status,
  appliedDate: leave.appliedDate,
  certificates: leave.certificates,

  // flatten student fields
  studentId: leave.studentId?._id,
  FullName: leave.studentId?.FullName,
  CollegeRollNo: leave.studentId?.CollegeRollNo,
  Semester: leave.studentId?.Semester,
}));
    res.status(200).json(formattedLeaves);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

exports.GetLeaveStatic = async (req, res) => {
  try {
    const stats = await Leavemodel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // normalize response
    const result = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0
    };

    stats.forEach(item => {
      result[item._id] = item.count;
      result.total += item.count;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave statistics" });
  }
};
