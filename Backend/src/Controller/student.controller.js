const mongoose = require("mongoose");
const AssignmentModel = require("../models/Assignment.model");
const AttendanceModel = require("../models/StudentAttendance.model");
const Bytez = require("bytez.js");
const Leavemodel = require("../models/Leave.model");


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

exports.generateplan = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Extract parameters from prompt for fallback
    const subjectsMatch = prompt.match(/Subjects:\s*([^\n]+)/i);
    const hoursMatch = prompt.match(/study time:\s*(\d+)\s*hours?/i);
    const hardestMatch = prompt.match(/difficult subject:\s*([^\n]+)/i);
    const daysMatch = prompt.match(/Days until exam:\s*(\d+)/i);
    const styleMatch = prompt.match(/Learning style:\s*(\w+)/i);

    const subjects = subjectsMatch ? subjectsMatch[1].trim() : "Math, Science";
    const studyHours = hoursMatch ? hoursMatch[1] : "2";
    const hardestSubject = hardestMatch ? hardestMatch[1].trim() : subjects.split(',')[0].trim();
    const daysUntilExam = daysMatch ? parseInt(daysMatch[1]) : 30;
    const learningStyle = styleMatch ? styleMatch[1].toLowerCase() : "visual";

    // Add a delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));

    const model = sdk.model("openai/gpt-oss-20b");

    console.log("Running Bytez model...");

    // Simplified prompt focused on JSON only
    const jsonPrompt = `Generate ONLY a valid JSON object (no explanations). Create a study plan with this structure:
{"motivation":"motivational message","weeklySchedule":[{"day":"Monday","sessions":[{"subject":"${subjects.split(',')[0].trim()}","time":"4:00 PM - 6:00 PM","duration":"2 hours","focus":"practice","tip":"study tip"}]}],"subjectPriorities":[{"subject":"${subjects.split(',')[0].trim()}","hoursPerWeek":10,"priority":"High","techniques":["tip1","tip2"]}],"milestones":[{"week":1,"goal":"complete theory","deadline":"date"}],"studyTips":["tip1","tip2"],"breakSchedule":"25min study, 5min break"}

Subjects: ${subjects}
Study hours: ${studyHours}
Days: ${daysUntilExam}
Hardest: ${hardestSubject}
Style: ${learningStyle}

Return ONLY the JSON:`;

    const { error, output } = await model.run([
      { role: "user", content: jsonPrompt }
    ]);

    if (error) {
      console.error("Bytez model error:", error);
      
      // Use fallback instead of returning error
      console.log("⚠️ AI failed, using smart fallback");
      const fallbackPlan = createFallbackStudyPlan(subjects, studyHours, hardestSubject, daysUntilExam, learningStyle);
      
      return res.json({ 
        content: [
          {
            type: "text",
            text: JSON.stringify(fallbackPlan)
          }
        ]
      });
    }

    // Extract content
    let contentText = '';
    if (typeof output === 'string') {
      contentText = output;
    } else if (typeof output === 'object' && output !== null) {
      contentText = output.content || output.text || output.message || JSON.stringify(output);
    }

    console.log("Raw output:", contentText.substring(0, 200));

    // Try to extract JSON
    const jsonMatch = contentText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      contentText = jsonMatch[0];
      
      // Validate JSON
      try {
        JSON.parse(contentText);
        console.log("✅ Valid JSON extracted from AI");
        
        return res.json({ 
          content: [
            {
              type: "text",
              text: contentText
            }
          ]
        });
      } catch (e) {
        console.log("❌ Invalid JSON, using fallback");
      }
    }

    // If we reach here, AI didn't return valid JSON - use fallback
    console.log("⚠️ No valid JSON found, using smart fallback");
    const fallbackPlan = createFallbackStudyPlan(subjects, studyHours, hardestSubject, daysUntilExam, learningStyle);
    
    res.json({ 
      content: [
        {
          type: "text",
          text: JSON.stringify(fallbackPlan)
        }
      ]
    });

  } catch (err) {
    console.error("SERVER CRASH:", err);
    
    // Even on crash, try to return a fallback
    try {
      const fallbackPlan = createFallbackStudyPlan("Math, Science", "2", "Math", 30, "visual");
      res.json({ 
        content: [
          {
            type: "text",
            text: JSON.stringify(fallbackPlan)
          }
        ]
      });
    } catch (fallbackErr) {
      res.status(500).json({ error: err.message });
    }
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
      approvedBy:"",
      rejectedBy: "",
      rejectionReason:"",
      certificates: req.files ? req.files.map(file => file.path) : [],
      status: 'pending',
      appliedDate: new Date()
    };
     await Leavemodel.create(leaveData)

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