const mongoose = require("mongoose");
const AssignmentModel = require("../models/Assignment.model");
const AttendanceModel = require("../models/StudentAttendance.model");
const Leavemodel = require("../models/Leave.model");
const axios = require('axios');


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

// Helper function to create a fallback study plan
function createFallbackStudyPlan(subjects, studyHours, hardestSubject, daysUntilExam, learningStyle) {
  const subjectList = subjects.split(',').map(s => s.trim());
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Create weekly schedule
  const weeklySchedule = days.map((day, index) => {
    const sessions = [];
    const hours = parseInt(studyHours) || 2;
    
    // Distribute subjects across the week
    const subjectIndex = index % subjectList.length;
    const subject = subjectList[subjectIndex];
    const isHard = subject.toLowerCase() === hardestSubject.toLowerCase();
    
    sessions.push({
      subject: subject,
      time: "4:00 PM - " + (4 + hours) + ":00 PM",
      duration: hours + " " + (hours === 1 ? "hour" : "hours"),
      focus: isHard ? "Focus on challenging concepts and practice problems" : "Review theory and complete exercises",
      tip: isHard ? "💪 Take it slow and steady - difficult topics need time!" : "✨ Stay consistent with daily practice"
    });
    
    return { day, sessions };
  });

  // Create subject priorities
  const subjectPriorities = subjectList.map(subject => {
    const isHard = subject.toLowerCase() === hardestSubject.toLowerCase();
    return {
      subject: subject,
      hoursPerWeek: isHard ? 10 : 7,
      priority: isHard ? "High" : "Medium",
      techniques: learningStyle === 'visual' 
        ? ["Use diagrams and mind maps", "Watch video tutorials", "Create colorful notes"]
        : learningStyle === 'auditory'
        ? ["Record and listen to notes", "Discuss with study groups", "Explain concepts aloud"]
        : ["Practice with hands-on exercises", "Take frequent breaks", "Use real-world examples"]
    };
  });

  // Create milestones
  const weeksAvailable = Math.ceil(daysUntilExam / 7);
  const milestones = [];
  for (let i = 0; i < Math.min(weeksAvailable, 4); i++) {
    const weekDate = new Date();
    weekDate.setDate(weekDate.getDate() + (i + 1) * 7);
    milestones.push({
      week: i + 1,
      goal: i === 0 ? "Complete all theory and note-taking" : 
            i === 1 ? "Finish practice problems and exercises" :
            i === 2 ? "Complete mock tests and review mistakes" :
            "Final revision and exam preparation",
      deadline: weekDate.toLocaleDateString()
    });
  }

  return {
    motivation: `🎯 You've got this! With ${daysUntilExam} days and ${studyHours} hours of daily focused study, you're setting yourself up for success. Let's make every study session count!`,
    weeklySchedule,
    subjectPriorities,
    milestones,
    studyTips: [
      "🧠 Sleep 7-8 hours for better memory retention",
      "💧 Stay hydrated while studying",
      "📱 Keep phone on silent during study time",
      "🎯 Set specific goals for each session",
      "⏰ Use the Pomodoro technique: 25 min study, 5 min break"
    ],
    breakSchedule: "25 minutes study + 5 minutes break (Pomodoro Technique)"
  };
}


const MODELS = [
  "openrouter/free",                                    // ✅ auto-picks any working free model
  "meta-llama/llama-3.3-70b-instruct:free",            // ✅ confirmed working Feb 2025
  "google/gemma-3-12b-it:free",                        // ✅ confirmed working
  "google/gemma-3-27b-it:free",                        // ✅ confirmed working
  "moonshotai/kimi-k2:free",                           // ✅ confirmed working
  "qwen/qwen3-coder:free",                             // ✅ confirmed working
  "mistralai/devstral-2512:free"                       // ✅ confirmed working
];
async function callOpenRouter(messages) {
  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
     const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  { 
    model, 
    messages,
    max_tokens: 4000  // ✅ add this line
  },
  {
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "X-Title": "AI Study Planner"
    },
    timeout: 60000  // increase timeout to 60s since response is larger
  }
);
      console.log(`✅ Model worked: ${model}`);
      return response.data.choices[0].message.content;
    } catch (err) {
      console.log(`❌ Model ${model} failed:`, err.response?.data?.error?.message || err.message);
    }
  }
  throw new Error("All OpenRouter models failed");
}

exports.generateplan = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let contentText = await callOpenRouter([
      {
        role: "system",
        content: "You are an expert study planner. You ONLY respond with valid JSON. Never add markdown, code blocks, or any explanation before or after the JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ]);

    console.log("Raw AI output:", contentText.substring(0, 300));

    // Clean markdown if present
    contentText = contentText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Extract JSON object
    const firstBrace = contentText.indexOf('{');
    const lastBrace = contentText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      contentText = contentText.substring(firstBrace, lastBrace + 1);
    }

    // Validate JSON
    try {
      JSON.parse(contentText);
      console.log("✅ Valid JSON received from AI");
    } catch (e) {
      console.error("❌ Invalid JSON from AI:", contentText.substring(0, 300));
      return res.status(500).json({ error: "AI returned invalid JSON. Please try again." });
    }

    return res.json({
      content: [{ type: "text", text: contentText }]
    });

  } catch (err) {
    console.error("SERVER CRASH:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
exports.submitleaves = async (req, res) => {
  try {
    const leaveData = {
      studentId: req.body.id,
      leaveType: req.body.leaveType,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason,
      approvedBy: "",
      rejectedBy: "",
      rejectionReason: "",
      certificates: req.cloudinaryUrls || [], // ✅ CHANGED: use Cloudinary URLs instead of local file paths
      status: 'pending',
      appliedDate: new Date()
    };

    await Leavemodel.create(leaveData);

    res.status(200).json({
      message: "Leave application submitted successfully",
      data: leaveData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getleavehistory = async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "studentId is required",
      });
    }

    const leaves = await Leavemodel
      .find({ studentId })
      .sort({ appliedDate: -1 }); // latest first

    return res.status(200).json({
      data: leaves,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leave history",
    });
  }
};