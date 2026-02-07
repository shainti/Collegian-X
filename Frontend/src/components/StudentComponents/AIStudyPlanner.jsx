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
  const [error, setError] = useState('');

  // AI-powered study plan generator using Claude API
  const createPlanWithAI = async () => {
    setLoading(true);
    setError('');

    // Calculate days until exam
    const daysUntilExam = examDate 
      ? Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24))
      : 30;

    // Create detailed prompt for AI
    const prompt = `You are an expert study coach. Create a detailed, personalized study plan for a student with these details:

**Student Information:**
- Subjects: ${subjects}
- Available study time: ${studyHours} hours per day
- Most difficult subject: ${hardestSubject || 'Not specified'}
- Days until exam: ${daysUntilExam} days
- Learning style: ${learningStyle}

**Please provide:**
1. A weekly study schedule (Monday to Sunday) that distributes subjects optimally
2. Specific time allocations for each subject based on difficulty
3. Study techniques suited to their learning style
4. Motivational tips and milestone goals
5. Break times and healthy study habits

**Format your response as JSON with this structure:**
{
  "motivation": "A motivational message",
  "weeklySchedule": [
    {
      "day": "Monday",
      "sessions": [
        {
          "subject": "Math",
          "time": "4:00 PM - 6:00 PM",
          "duration": "2 hours",
          "focus": "Practice problems",
          "tip": "Start with easy problems"
        }
      ]
    }
  ],
  "subjectPriorities": [
    {
      "subject": "Math",
      "hoursPerWeek": 10,
      "priority": "High",
      "techniques": ["Practice daily", "Use visual aids"]
    }
  ],
  "milestones": [
    {
      "week": 1,
      "goal": "Complete all theory topics",
      "deadline": "Date"
    }
  ],
  "studyTips": ["Tip 1", "Tip 2", "Tip 3"],
  "breakSchedule": "25 min study, 5 min break (Pomodoro)"
}

Make it encouraging, practical, and tailored to their specific situation!`;

try{
  const response = await fetch("http://localhost:3000/api/Student/generate-plan", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: prompt })
});
      if (!response.ok) {
        throw new Error('Failed to generate study plan');
      }
      const data = await response.json();
      console.log(data);
      // Extract the AI's response
      const aiResponse = data.content[0].text;
      
      // Try to parse JSON from AI response
      let parsedPlan;
      try {
        // Remove markdown code blocks if present
        const jsonText = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedPlan = JSON.parse(jsonText);
      } catch (parseError) {
        // If JSON parsing fails, create a structured plan from the text
        parsedPlan = createFallbackPlan(aiResponse);
      }

      setStudyPlan(parsedPlan);
      setShowPlan(true);
    
    } catch (err) {
      console.error('AI Error:', err);
      setError('Oops! AI had trouble creating your plan. Using smart fallback plan instead.');
      
      // Create a smart fallback plan
      const fallbackPlan = createSmartFallbackPlan();
      setStudyPlan(fallbackPlan);
      setShowPlan(true);
    } finally {
      setLoading(false);
    }
  };

  // Smart fallback plan when AI is unavailable
  const createSmartFallbackPlan = () => {
    const subjectList = subjects.split(',').map(s => s.trim());
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const daysUntilExam = examDate 
      ? Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24))
      : 30;

    // Create weekly schedule
    const weeklySchedule = days.map((day, dayIndex) => {
      const sessions = [];
      const subjectsPerDay = Math.min(2, subjectList.length);
      
      for (let i = 0; i < subjectsPerDay; i++) {
        const subjectIndex = (dayIndex + i) % subjectList.length;
        const subject = subjectList[subjectIndex];
        const isHard = subject === hardestSubject;
        const hours = isHard ? Math.min(parseInt(studyHours) + 1, 4) : Math.max(1, parseInt(studyHours) - 1);
        
        const startHour = 16 + (i * hours); // Start at 4 PM
        const endHour = startHour + hours;
        
        sessions.push({
          subject: subject,
          time: `${startHour > 12 ? startHour - 12 : startHour}:00 ${startHour >= 12 ? 'PM' : 'AM'} - ${endHour > 12 ? endHour - 12 : endHour}:00 ${endHour >= 12 ? 'PM' : 'AM'}`,
          duration: `${hours} ${hours === 1 ? 'hour' : 'hours'}`,
          focus: isHard ? 'Extra practice & problem-solving' : 'Theory & revision',
          tip: getTipForSubject(subject, isHard, learningStyle)
        });
      }
      
      return { day, sessions };
    });

    // Create subject priorities
    const subjectPriorities = subjectList.map(subject => {
      const isHard = subject === hardestSubject;
      return {
        subject: subject,
        hoursPerWeek: isHard ? parseInt(studyHours) * 7 + 7 : parseInt(studyHours) * 5,
        priority: isHard ? 'High' : 'Medium',
        techniques: getTechniquesForStyle(learningStyle, subject)
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
        goal: i === 0 ? 'Complete all theory topics & notes' :
              i === 1 ? 'Finish practice problems & exercises' :
              i === 2 ? 'Complete mock tests & identify weak areas' :
              'Final revision & exam preparation',
        deadline: weekDate.toLocaleDateString()
      });
    }

    // Create study tips based on learning style
    const studyTips = getStudyTipsForStyle(learningStyle, hardestSubject);

    return {
      motivation: `🌟 Great job starting your study journey! You have ${daysUntilExam} days to prepare. With ${studyHours} hours of daily focused study, you'll be well-prepared for success!`,
      weeklySchedule,
      subjectPriorities,
      milestones,
      studyTips,
      breakSchedule: '25 minutes study + 5 minutes break (Pomodoro Technique)',
      examCountdown: `${daysUntilExam} days until exam`
    };
  };

  // Helper function for subject-specific tips
  const getTipForSubject = (subject, isHard, style) => {
    const tips = {
      'Math': isHard ? '💪 Focus on practice problems daily. Review formulas before bed.' : '✨ Practice 5 problems daily to stay sharp.',
      'Science': isHard ? '🔬 Use diagrams and experiments. Teach concepts to others.' : '✨ Make flashcards for key concepts.',
      'Physics': isHard ? '⚛️ Draw diagrams for every problem. Understand concepts, not just formulas.' : '✨ Review previous problems weekly.',
      'Chemistry': isHard ? '🧪 Make reaction charts. Practice equations daily.' : '✨ Use mnemonics for element properties.',
      'English': isHard ? '📖 Read 30 minutes daily. Practice writing essays weekly.' : '✨ Maintain a vocabulary journal.',
      'History': isHard ? '📜 Create timelines. Use mind maps for connections.' : '✨ Review dates with flashcards.',
      'Biology': isHard ? '🧬 Draw and label diagrams. Make concept maps.' : '✨ Use mnemonics for processes.'
    };
    
    return tips[subject] || (isHard ? `💪 Give extra time to ${subject}` : `✨ Regular practice with ${subject}`);
  };

  // Helper function for learning style techniques
  const getTechniquesForStyle = (style, subject) => {
    const techniques = {
      visual: [
        'Create mind maps and diagrams',
        'Use color-coded notes',
        'Watch educational videos',
        'Draw flowcharts for processes'
      ],
      auditory: [
        'Record and listen to lectures',
        'Discuss topics with study groups',
        'Explain concepts aloud',
        'Use mnemonic rhymes'
      ],
      kinesthetic: [
        'Take breaks to move around',
        'Use hands-on experiments',
        'Write notes by hand',
        'Create physical models'
      ],
      reading: [
        'Make detailed written notes',
        'Read textbooks thoroughly',
        'Summarize in your own words',
        'Practice written questions'
      ]
    };
    
    return techniques[style] || techniques.visual;
  };

  // Helper function for study tips
  const getStudyTipsForStyle = (style, hardSubject) => {
    const baseTips = [
      '🧠 Sleep 7-8 hours for better memory retention',
      '💧 Stay hydrated - drink water while studying',
      '🍎 Eat brain-healthy foods (nuts, fruits, fish)',
      '📱 Put phone on silent during study sessions',
      '🎯 Set specific goals for each study session'
    ];

    const styleTips = {
      visual: '🎨 Use highlighters and draw diagrams for complex topics',
      auditory: '🎧 Record yourself explaining topics and listen back',
      kinesthetic: '🤸 Take movement breaks every 30 minutes',
      reading: '📚 Rewrite notes in your own words for better retention'
    };

    const hardTip = hardSubject 
      ? `💪 Dedicate morning hours (when your brain is freshest) to ${hardSubject}`
      : '⏰ Study your hardest subjects when you have the most energy';

    return [...baseTips, styleTips[style], hardTip];
  };

  // Fallback plan from text response
  const createFallbackPlan = (text) => {
    return createSmartFallbackPlan();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-32 left-10 text-5xl animate-float">📚</div>
        <div className="absolute top-52 right-20 text-6xl animate-float-delayed">🎓</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float-delayed-2">🤖</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float">✨</div>
        <div className="absolute bottom-20 right-1/3 text-5xl animate-float-delayed">💡</div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-delayed" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4 shadow-2xl animate-bounce-slow">
            <span className="text-4xl">🤖</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            AI Study Planner
          </h1>
          <p className="text-gray-300 text-lg animate-fade-in-delayed">
            Let AI create a personalized study plan just for you! ✨
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-300 text-center">{error}</p>
          </div>
        )}

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
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
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
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
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
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
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
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
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
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg scale-105'
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
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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
        ) : (
          // ========== PLAN VIEW ==========
          <div className="space-y-6">
            
            {/* Motivation Banner */}
            <div className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-pink-500/30 shadow-2xl">
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

            {/* Weekly Schedule */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📅</span>
                <span>Your Weekly Schedule</span>
              </h3>
              <div className="space-y-4">
                {studyPlan.weeklySchedule?.map((dayPlan, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-pink-500/30 transition-all">
                    <h4 className="text-white font-bold text-lg mb-3">{dayPlan.day}</h4>
                    <div className="space-y-3">
                      {dayPlan.sessions?.map((session, sIndex) => (
                        <div key={sIndex} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                            <div>
                              <span className="text-pink-400 font-semibold text-lg">{session.subject}</span>
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

            {/* Subject Priorities */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🎯</span>
                <span>Subject Priorities</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {studyPlan.subjectPriorities?.map((subject, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all">
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
                            <span className="text-pink-400">✓</span>
                            <span>{tech}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🏁</span>
                <span>Study Milestones</span>
              </h3>
              <div className="space-y-3">
                {studyPlan.milestones?.map((milestone, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4 hover:border-pink-500/30 transition-all">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {milestone.week}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">{milestone.goal}</h4>
                      <p className="text-gray-400 text-sm">📅 Due: {milestone.deadline}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-2 border-white/30 bg-white/10 checked:bg-pink-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Study Tips */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>💡</span>
                <span>AI Study Tips</span>
              </h3>
              <div className="space-y-3">
                {studyPlan.studyTips?.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white/5 rounded-lg p-3 border border-white/10">
                    <span className="text-pink-400 font-bold mt-0.5">✓</span>
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
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
              >
                🖨️ Print Plan
              </button>
            </div>
          </div>
        )}
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