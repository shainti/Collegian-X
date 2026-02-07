const mongoose = require("mongoose");
const AssignmentModel = require("../models/Assignment.model");
const AttendanceModel = require("../models/StudentAttendance.model");
const Bytez = require("bytez.js");

const sdk = new Bytez(process.env.API_KEY);

exports.GetStudentAssignment = async (req, res) => {
  try {
    const assignment = await AssignmentModel.find().sort({ createdAt: -1 });
    res.status(200).json({ assignment });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};

exports.viewtimetable = async (req, res) => {};

exports.GetStudentAttendance = async (req, res) => {
  const studentId = req.params.id;

  try {
    const attendanceRecords = await AttendanceModel.find({ studentId });

    if (!attendanceRecords.length) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found"
      });
    }

    const subjectMap = {};

    attendanceRecords.forEach(record => {
      if (!subjectMap[record.subject]) {
        subjectMap[record.subject] = {
          name: record.subject,
          totalClasses: 0,
          attendedClasses: 0,
          month: record.month,
          bgColor: "bg-gradient-to-br from-blue-600/20 via-blue-700/20 to-blue-800/20",
          iconColor: "bg-gradient-to-br from-blue-500 to-blue-600",
          icon: "📚"
        };
      }

      subjectMap[record.subject].totalClasses += record.totalClasses;
      subjectMap[record.subject].attendedClasses += record.attendedClasses;
    });

    const subjects = Object.values(subjectMap).map((subject, index) => ({
      id: index + 1,
      ...subject
    }));

    res.status(200).json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching attendance data"
    });
  }
};

exports.generateplan = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Add a delay to avoid rate limiting (for free tier)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const model = sdk.model("openai/gpt-oss-20b");

    console.log("Running Bytez model...");

    const { error, output } = await model.run([
      { role: "user", content: prompt }
    ]);

    console.log("Bytez output:", output);

    if (error) {
      console.error("Bytez model error:", error);
      
      // If rate limited, return a specific error code
      if (error.includes("Rate limited")) {
        return res.status(429).json({ 
          error: "Rate limit exceeded. Please try again in a moment.",
          rateLimited: true 
        });
      }
      
      return res.status(500).json({ error });
    }

    // Return in a format compatible with Anthropic API response
    res.json({ 
      content: [
        {
          type: "text",
          text: output
        }
      ]
    });

  } catch (err) {
    console.error("SERVER CRASH:", err);
    res.status(500).json({ error: err.message });
  }
};