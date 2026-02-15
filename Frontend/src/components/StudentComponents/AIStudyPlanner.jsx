import React, { useState } from 'react';

export default function AIStudyPlanner() {
  // State management
  const [subjects, setSubjects] = useState('');
  const [studyHours, setStudyHours] = useState('2');
  const [hardestSubject, setHardestSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [learningStyle, setLearningStyle] = useState('visual');
  const [showPlan, setShowPlan] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // AI-powered study plan generator using Claude API
  const createPlanWithAI = async () => {
    setLoading(true);

    // Calculate days until exam
    const daysUntilExam = examDate 
      ? Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24))
      : 30;

    // Create detailed prompt for AI
    const prompt = `You are an expert study coach. Create a detailed, personalized study plan for a student.

**Student Information:**
- Subjects: ${subjects}
- Available study time: ${studyHours} hours per day
- Most difficult subject: ${hardestSubject || 'Not specified'}
- Days until exam: ${daysUntilExam} days
- Learning style: ${learningStyle}

**IMPORTANT: Respond ONLY with valid JSON. Do not include any explanation, analysis, or text before or after the JSON.**

Return this exact JSON structure:
{
  "motivation": "An encouraging motivational message for the student",
  "weeklySchedule": [
    {
      "day": "Monday",
      "sessions": [
        {
          "subject": "Subject name",
          "time": "4:00 PM - 6:00 PM",
          "duration": "2 hours",
          "focus": "What to focus on",
          "tip": "A helpful study tip"
        }
      ]
    }
  ],
  "subjectPriorities": [
    {
      "subject": "Subject name",
      "hoursPerWeek": 10,
      "priority": "High",
      "techniques": ["Technique 1", "Technique 2"]
    }
  ],
  "milestones": [
    {
      "week": 1,
      "goal": "Milestone goal",
      "deadline": "Date"
    }
  ],
  "studyTips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "breakSchedule": "25 min study, 5 min break (Pomodoro)"
}

Create a weekly schedule (Monday-Sunday) that distributes subjects optimally, includes specific time allocations based on difficulty, study techniques for ${learningStyle} learning style, and motivational milestone goals. Make it encouraging and practical!

REMEMBER: Output ONLY the JSON object, nothing else.`;

    try {
      const response = await fetch("https://collegian-x-1.onrender.com/api/Student/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate study plan');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Extract the AI's response - handle different response formats
      let aiResponse;
      
      // Check if data has content array with objects containing text
      if (data.content && Array.isArray(data.content) && data.content.length > 0) {
        const firstContent = data.content[0];
        
        // Handle format: {content: [{text: {role: "assistant", content: "..."}}]}
        if (firstContent.text && typeof firstContent.text === 'object') {
          aiResponse = firstContent.text.content || JSON.stringify(firstContent.text);
        }
        // Handle format: {content: [{text: "..."}]}
        else if (firstContent.text && typeof firstContent.text === 'string') {
          aiResponse = firstContent.text;
        }
        // Handle format: {content: [{role: "assistant", content: "..."}]}
        else if (firstContent.content && typeof firstContent.content === 'string') {
          aiResponse = firstContent.content;
        }
        // Handle format: {content: [{role: "assistant", content: {...}}]}
        else if (firstContent.content && typeof firstContent.content === 'object') {
          aiResponse = JSON.stringify(firstContent.content);
        }
      }
      // Handle direct text response
      else if (typeof data === 'string') {
        aiResponse = data;
      }
      // Handle {text: "..."} format
      else if (data.text) {
        aiResponse = data.text;
      }
      
      console.log('Extracted AI Response:', aiResponse);
      
      // Make sure aiResponse is a string
      if (typeof aiResponse !== 'string') {
        console.error('aiResponse is not a string:', typeof aiResponse, aiResponse);
        throw new Error('Invalid AI response format');
      }
      
      // Try to parse JSON from AI response
      let parsedPlan;
      try {
        // Remove markdown code blocks if present
        let jsonText = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // If the response starts with "analysis" or other text, try to extract JSON
        // Look for the first { and last } to extract just the JSON part
        const firstBrace = jsonText.indexOf('{');
        const lastBrace = jsonText.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonText = jsonText.substring(firstBrace, lastBrace + 1);
        }
        
        parsedPlan = JSON.parse(jsonText);
        console.log('Parsed Plan:', parsedPlan);
      } catch (parseError) {
        console.log('JSON Parse Error:', parseError);
        console.log('Failed text:', aiResponse.substring(0, 500)); // Show first 500 chars
        
        // If JSON parsing fails, show raw AI response
        parsedPlan = {
          motivation: "I've created a study plan for you, but there was a formatting issue. Please try generating again!",
          rawResponse: true,
          errorDetails: aiResponse.substring(0, 1000) // Show first 1000 chars for debugging
        };
      }

      setStudyPlan(parsedPlan);
      setShowPlan(true);
    } catch (err) {
      console.error('AI Error:', err);
      // Simply don't show the plan if AI fails
      setStudyPlan(null);
      setShowPlan(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-32 left-10 text-5xl animate-float">📚</div>
        <div className="absolute top-52 right-20 text-6xl animate-float-delayed">🎓</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">🤖</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">✨</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">💡</div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-delayed" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4 shadow-2xl animate-bounce-slow">
            <span className="text-4xl">🤖</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            AI Study Planner
          </h1>
          <p className="text-gray-300 text-lg animate-fade-in-delayed">
            Let AI create a personalized study plan just for you! ✨
          </p>
        </div>

        {/* Main Content */}
        {!showPlan ? (
          // ========== FORM VIEW ==========
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
            
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Tell me about your studies 📖
            </h2>

            {/* Question 1: Subjects */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2 text-lg">
                📚 What subjects are you studying?
              </label>
              <p className="text-gray-400 text-sm mb-3">
                Separate each subject with a comma
              </p>
              <input
                type="text"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="Math, Science, English, History"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Question 2: Study Hours */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2 text-lg">
                ⏰ How many hours can you study per day?
              </label>
              <select
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="5">5 hours</option>
                <option value="6">6+ hours</option>
              </select>
            </div>

            {/* Question 3: Hardest Subject */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2 text-lg">
                😰 Which subject is most challenging for you?
              </label>
              <p className="text-gray-400 text-sm mb-3">
                Optional - helps AI prioritize your study time
              </p>
              <input
                type="text"
                value={hardestSubject}
                onChange={(e) => setHardestSubject(e.target.value)}
                placeholder="e.g., Physics"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Question 4: Exam Date */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2 text-lg">
                📅 When is your exam or target date?
              </label>
              <p className="text-gray-400 text-sm mb-3">
                Optional - helps create a timeline
              </p>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Question 5: Learning Style */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-3 text-lg">
                🎨 What's your learning style?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'visual', emoji: '👁️', label: 'Visual', desc: 'Diagrams & videos' },
                  { value: 'auditory', emoji: '👂', label: 'Auditory', desc: 'Listening & discussion' },
                  { value: 'kinesthetic', emoji: '🤸', label: 'Kinesthetic', desc: 'Hands-on learning' },
                  { value: 'reading', emoji: '📖', label: 'Reading/Writing', desc: 'Notes & textbooks' }
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setLearningStyle(style.value)}
                    className={`p-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                      learningStyle === style.value
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg scale-105'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-3xl mb-2">{style.emoji}</div>
                    <div className="text-sm font-bold">{style.label}</div>
                    <div className="text-xs opacity-70 mt-1">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={createPlanWithAI}
              disabled={!subjects || loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>AI is creating your perfect plan...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generate My AI Study Plan</span>
                  <span>🚀</span>
                </>
              )}
            </button>
          </div>
        ) : studyPlan ? (
          // ========== PLAN VIEW (Only AI Response) ==========
          <div className="space-y-6">
            
            {studyPlan.rawResponse ? (
              // Raw AI Response
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-4 text-center">
                  🎯 Your AI Study Plan
                </h2>
                <div className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                  {studyPlan.motivation}
                </div>
              </div>
            ) : (
              <>
                {/* Motivation Banner */}
                {studyPlan.motivation && (
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-blue-500/30 shadow-2xl">
                    <h2 className="text-3xl font-bold text-white mb-4 text-center">
                      🎯 Your Personalized Study Plan
                    </h2>
                    <p className="text-white text-lg text-center leading-relaxed">
                      {studyPlan.motivation}
                    </p>
                    {studyPlan.examCountdown && (
                      <div className="mt-4 text-center">
                        <span className="inline-block bg-white/20 px-6 py-2 rounded-full text-white font-bold">
                          ⏰ {studyPlan.examCountdown}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Weekly Schedule */}
                {studyPlan.weeklySchedule && studyPlan.weeklySchedule.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <span>📅</span>
                      <span>Your Weekly Schedule</span>
                    </h3>
                    <div className="space-y-4">
                      {studyPlan.weeklySchedule.map((dayPlan, index) => (
                        <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all">
                          <h4 className="text-white font-bold text-lg mb-3">{dayPlan.day}</h4>
                          <div className="space-y-3">
                            {dayPlan.sessions?.map((session, sIndex) => (
                              <div key={sIndex} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                                  <div>
                                    <span className="text-blue-400 font-semibold text-lg">{session.subject}</span>
                                    <span className="text-gray-400 text-sm ml-2">({session.focus})</span>
                                  </div>
                                  <div className="text-gray-300 text-sm">
                                    <span className="font-semibold">{session.time}</span>
                                    <span className="ml-2 text-gray-400">• {session.duration}</span>
                                  </div>
                                </div>
                                <p className="text-gray-300 text-sm italic">{session.tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject Priorities */}
                {studyPlan.subjectPriorities && studyPlan.subjectPriorities.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <span>🎯</span>
                      <span>Subject Priorities</span>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {studyPlan.subjectPriorities.map((subject, index) => (
                        <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-white font-bold text-lg">{subject.subject}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              subject.priority === 'High' 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                : subject.priority === 'Medium'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                              {subject.priority}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">
                            <strong>{subject.hoursPerWeek} hours/week</strong> recommended
                          </p>
                          {subject.techniques && (
                            <div className="space-y-1">
                              {subject.techniques.slice(0, 2).map((tech, tIndex) => (
                                <div key={tIndex} className="flex items-start gap-2 text-gray-400 text-xs">
                                  <span className="text-blue-400">✓</span>
                                  <span>{tech}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestones */}
                {studyPlan.milestones && studyPlan.milestones.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <span>🏁</span>
                      <span>Study Milestones</span>
                    </h3>
                    <div className="space-y-3">
                      {studyPlan.milestones.map((milestone, index) => (
                        <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4 hover:border-blue-500/30 transition-all">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {milestone.week}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold mb-1">{milestone.goal}</h4>
                            <p className="text-gray-400 text-sm">📅 Due: {milestone.deadline}</p>
                          </div>
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-2 border-white/30 bg-white/10 checked:bg-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Study Tips */}
                {studyPlan.studyTips && studyPlan.studyTips.length > 0 && (
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-cyan-500/30 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <span>💡</span>
                      <span>AI Study Tips</span>
                    </h3>
                    <div className="space-y-3">
                      {studyPlan.studyTips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3 bg-white/5 rounded-lg p-3 border border-white/10">
                          <span className="text-blue-400 font-bold mt-0.5">✓</span>
                          <p className="text-gray-200 flex-1">{tip}</p>
                        </div>
                      ))}
                    </div>
                    {studyPlan.breakSchedule && (
                      <div className="mt-6 bg-white/10 rounded-xl p-4 border border-white/20">
                        <p className="text-white font-semibold text-center">
                          ⏱️ {studyPlan.breakSchedule}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowPlan(false)}
                className="flex-1 bg-white/10 text-white py-4 rounded-xl font-semibold hover:bg-white/20 hover:scale-105 transition-all border border-white/20"
              >
                ← Create New Plan
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
              >
                🖨️ Print Plan
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite 1s;
        }
        .animate-float-delayed-2 {
          animation: float 4s ease-in-out infinite 2s;
        }
        .animate-pulse-delayed {
          animation: pulse 3s infinite 1s;
        }
        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-fade-in-delayed {
          animation: fadeInUp 0.8s ease-out 0.2s backwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}