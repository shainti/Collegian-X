const { default: mongoose } = require("mongoose");
const AssignmentModel = require("../models/Assignment.model");
const AttendanceModel = require('../models/StudentAttendance.model')

exports.GetStudentAssignment = async (req, res) => {
 try {
    const assignment = await AssignmentModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      assignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }

}

exports.viewtimetable = async (req, res) => {
  
};

exports.GetStudentAttendance = async (req, res) => {
  const studentId = req.params.id;
  
  try {
    // Find all attendance records for this student
    const attendanceRecords = await AttendanceModel.find({ studentId: studentId });
    
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found"
      });
    }

    // Group by subject and calculate totals
    const subjectMap = {};
    
    attendanceRecords.forEach(record => {
      if (!subjectMap[record.subject]) {
        subjectMap[record.subject] = {
          name: record.subject,
          totalClasses: 0,
          attendedClasses: 0,
          month:record.month,
          // Add appropriate colors and icons based on subject
          bgColor: 'bg-gradient-to-br from-blue-600/20 via-blue-700/20 to-blue-800/20',
          iconColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
          icon: '📚'
        };
      }
      
      subjectMap[record.subject].totalClasses += record.totalClasses;
      subjectMap[record.subject].attendedClasses += record.attendedClasses;
    });

    // Convert to array
    const subjects = Object.values(subjectMap).map((subject, index) => ({
      id: index + 1,
      ...subject
    }));

    res.status(200).json({
      success: true,
      subjects
    });
    
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching attendance data",
      error: error.message
    });
  }
};

exports.generateplan = async (req, res) => {
   try {
    const { prompt } = req.body;
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "YOUR_API_KEY_HERE", // Get from anthropic.com
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
