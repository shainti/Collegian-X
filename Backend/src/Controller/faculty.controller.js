const { default: mongoose } = require("mongoose");
const AssignmentModel = require("../models/Assignment.model");
const StudentModel = require('../models/Student.model')
const StudentAttendance = require('../models/StudentAttendance.model')

exports.Assignment = async (req, res) => {
  try {
    const { topic, subject, teacherName,year, assignedDate, dueDate, questions } = req.body;

    const assignment = await AssignmentModel.create({
      topic,
      subject,
      teacherName,
      year,
      assignedDate,
      dueDate,
      questions,
    });

    res.status(201).json({
      assignment,
      message: "Assignment created",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create assignment",
      error: error.message,
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

    // Validation
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
// exports.Getattendance= async (req, res)=> {
//  try {
//     const { studentId } = req.params;
//     const { year, subject, month } = req.query;

//     const filters = {};
//     if (year) filters.year = year;
//     if (subject) filters.subject = subject;
//     if (month) filters.month = month;

//     const attendance = await StudentAttendance.getStudentAttendance(studentId, filters);

//     res.status(200).json({
//       success: true,
//       count: attendance.length,
//       data: attendance
//     });

//   } catch (error) {
//     console.error('Get student attendance error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch student attendance'
//     });
//   }
// }

// exports.GetReport= async (req, res)=> {
// try {
//     const { year, subject, month } = req.query;

//     if (!year || !subject || !month) {
//       return res.status(400).json({
//         success: false,
//         message: 'Year, subject, and month are required'
//       });
//     }

//     const report = await StudentAttendance.getMonthlyReport(year, subject, month);

//     res.status(200).json({
//       success: true,
//       count: report.length,
//       data: report
//     });

//   } catch (error) {
//     console.error('Get monthly report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch monthly report'
//     });
//   }
// }
// exports.Getlowattendance = async (req, res) =>{
// try {
//     const { year, subject, month } = req.query;

//     const query = {};
//     if (year) query.year = year;
//     if (subject) query.subject = subject;
//     if (month) query.month = month;

//     const allAttendance = await StudentAttendance.find(query)
//       .populate('studentId', 'FullName CollegeRollNo')
//       .exec();

//     // Filter students with low attendance
//     const lowAttendance = allAttendance.filter(record => record.hasLowAttendance());

//     res.status(200).json({
//       success: true,
//       count: lowAttendance.length,
//       data: lowAttendance
//     });

//   } catch (error) {
//     console.error('Get low attendance error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch low attendance students'
//     });
//   }
// }

