import React, { useState, useEffect } from 'react';
import { Save, Download, Upload, BarChart3, TrendingUp, AlertTriangle, CheckCircle, FileText, Calendar, Users } from 'lucide-react';

const OrganizationalScorecardAgent = () => {
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState({});
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [companyName, setCompanyName] = useState('');
  const [assessorName, setAssessorName] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [savedAssessments, setSavedAssessments] = useState([]);
  const [currentView, setCurrentView] = useState('assessment'); // 'assessment', 'history', 'analytics'
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');

  const statements = [
    {
      id: 1,
      text: "We have a clear vision in writing that has been properly communicated and is shared by everyone in the company.",
      category: "Vision & Direction",
      priority: "high"
    },
    {
      id: 2,
      text: "Our core values are clear, and we are hiring, reviewing, rewarding, and firing around them.",
      category: "Values & Culture",
      priority: "high"
    },
    {
      id: 3,
      text: "Our Core Focus™ (core business) is clear, and we keep our people, systems and processes aligned and focused on it.",
      category: "Focus & Strategy",
      priority: "high"
    },
    {
      id: 4,
      text: "Our 10-Year Target™ (big, long-range business goal) is clear, communicated regularly, and is shared by all.",
      category: "Vision & Direction",
      priority: "medium"
    },
    {
      id: 5,
      text: "Our target market (definition of our ideal customer) is clear, and all of our marketing and sales efforts are focused on it.",
      category: "Market & Sales",
      priority: "high"
    },
    {
      id: 6,
      text: "Our 3 Uniques™ (differentiators) are clear, and all of our marketing and sales efforts communicate them.",
      category: "Market & Sales",
      priority: "medium"
    },
    {
      id: 7,
      text: "We have a proven process for doing business with our customers. It has been named and visually illustrated, and all of our salespeople use it.",
      category: "Market & Sales",
      priority: "medium"
    },
    {
      id: 8,
      text: "All of the people in our organization are the 'right people' (they fit our culture and share our core values).",
      category: "People & Team",
      priority: "high"
    },
    {
      id: 9,
      text: "Our Accountability Chart™ (organizational chart that includes roles/responsibilities) is clear, complete, and constantly updated.",
      category: "Organization & Structure",
      priority: "medium"
    },
    {
      id: 10,
      text: "Everyone is in the 'right seat' (they 'get it, want it, and have the capacity to do their jobs well').",
      category: "People & Team",
      priority: "high"
    },
    {
      id: 11,
      text: "Our leadership team is open and honest, and demonstrates a high level of trust.",
      category: "Leadership & Trust",
      priority: "high"
    },
    {
      id: 12,
      text: "Everyone has Rocks (1 to 7 priorities per quarter) and is focused on them.",
      category: "Execution & Goals",
      priority: "medium"
    },
    {
      id: 13,
      text: "Everyone is engaged in regular weekly meetings.",
      category: "Communication & Meetings",
      priority: "medium"
    },
    {
      id: 14,
      text: "All meetings are on the same day and at the same time each week, have the same agenda, start on time, and end on time.",
      category: "Communication & Meetings",
      priority: "low"
    },
    {
      id: 15,
      text: "All teams clearly identify, discuss, and solve issues for the long-term greater good of the company.",
      category: "Problem Solving",
      priority: "high"
    },
    {
      id: 16,
      text: "Our Core Processes are documented, simplified, and followed by all to consistently produce the results we want.",
      category: "Process & Systems",
      priority: "medium"
    },
    {
      id: 17,
      text: "We have systems for receiving regular feedback from customers and employees, so we always know their level of satisfaction.",
      category: "Feedback & Improvement",
      priority: "medium"
    },
    {
      id: 18,
      text: "A Scorecard for tracking weekly metrics/measurables is in place.",
      category: "Metrics & Tracking",
      priority: "medium"
    },
    {
      id: 19,
      text: "Everyone in the organization has at least one number they are accountable for keeping on track each week.",
      category: "Metrics & Tracking",
      priority: "medium"
    },
    {
      id: 20,
      text: "We have a budget and are monitoring it regularly (e.g., monthly or quarterly).",
      category: "Financial Management",
      priority: "high"
    }
  ];

  const categories = [...new Set(statements.map(s => s.category))];

  // Load saved assessments on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('orgAssessments') || '[]');
    setSavedAssessments(saved);
    
    const members = JSON.parse(localStorage.getItem('teamMembers') || '[]');
    setTeamMembers(members);
  }, []);

  const handleScoreChange = (id, score) => {
    setScores(prev => ({ ...prev, [id]: parseInt(score) }));
  };

  const handleNoteChange = (id, note) => {
    setNotes(prev => ({ ...prev, [id]: note }));
  };

  const calculateTotalScore = () => {
    const validScores = Object.values(scores).filter(score => !isNaN(score));
    return validScores.reduce((sum, score) => sum + score, 0);
  };

  const calculatePercentageScore = () => {
    const validScores = Object.values(scores).filter(score => !isNaN(score));
    if (validScores.length === 0) return 0;
    return Math.round((calculateTotalScore() / (validScores.length * 5)) * 100);
  };

  const calculateWeightedScore = () => {
    const weightMap = { high: 3, medium: 2, low: 1 };
    let totalWeightedScore = 0;
    let totalWeight = 0;

    statements.forEach(statement => {
      const score = scores[statement.id];
      if (!isNaN(score)) {
        const weight = weightMap[statement.priority];
        totalWeightedScore += score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round((totalWeightedScore / (totalWeight * 5)) * 100) : 0;
  };

  const getCategoryScore = (category) => {
    const categoryStatements = statements.filter(s => s.category === category);
    const categoryScores = categoryStatements.map(s => scores[s.id]).filter(score => !isNaN(score));
    if (categoryScores.length === 0) return 0;
    return Math.round((categoryScores.reduce((sum, score) => sum + score, 0) / (categoryScores.length * 5)) * 100);
  };

  const getScoreInterpretation = (percentage) => {
    if (percentage >= 80) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle };
    if (percentage >= 60) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-50", icon: TrendingUp };
    if (percentage >= 40) return { level: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: AlertTriangle };
    return { level: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-50", icon: AlertTriangle };
  };

  const getActionRecommendations = () => {
    const lowScoring = categories
      .map(cat => ({ category: cat, score: getCategoryScore(cat) }))
      .filter(item => item.score < 60)
      .sort((a, b) => a.score - b.score);

    const recommendations = lowScoring.map(item => ({
      category: item.category,
      score: item.score,
      actions: getActionsForCategory(item.category, item.score)
    }));

    return recommendations;
  };

  const getActionsForCategory = (category, score) => {
    const actionMap = {
      "Vision & Direction": [
        "Schedule leadership retreat to define/refine vision",
        "Create vision communication plan",
        "Implement quarterly vision alignment sessions"
      ],
      "Values & Culture": [
        "Develop values-based hiring framework",
        "Create values integration in performance reviews",
        "Establish cultural ambassador program"
      ],
      "People & Team": [
        "Implement people analytics dashboard",
        "Create career development pathways",
        "Establish regular one-on-one meeting cadence"
      ],
      "Leadership & Trust": [
        "Implement 360-degree feedback system",
        "Create leadership transparency initiatives",
        "Establish regular leadership communication forums"
      ],
      "Market & Sales": [
        "Conduct market segmentation analysis",
        "Develop ideal customer profiles",
        "Create sales process documentation"
      ]
    };

    return actionMap[category] || ["Schedule assessment with relevant teams", "Develop improvement action plan", "Set measurable improvement targets"];
  };

  const saveAssessment = () => {
    const assessment = {
      id: Date.now(),
      companyName,
      assessorName,
      selectedMember,
      assessmentDate,
      scores,
      notes,
      totalScore: calculateTotalScore(),
      percentageScore: calculatePercentageScore(),
      weightedScore: calculateWeightedScore(),
      categoryScores: categories.reduce((acc, cat) => ({
        ...acc,
        [cat]: getCategoryScore(cat)
      }), {})
    };

    const updatedAssessments = [...savedAssessments, assessment];
    setSavedAssessments(updatedAssessments);
    localStorage.setItem('orgAssessments', JSON.stringify(updatedAssessments));
    alert('Assessment saved successfully!');
  };

  const loadAssessment = (assessment) => {
    setCompanyName(assessment.companyName);
    setAssessorName(assessment.assessorName);
    setSelectedMember(assessment.selectedMember || '');
    setAssessmentDate(assessment.assessmentDate);
    setScores(assessment.scores);
    setNotes(assessment.notes);
    setCurrentView('assessment');
  };

  const exportData = () => {
    const data = {
      companyName,
      assessorName,
      selectedMember,
      assessmentDate,
      scores,
      notes,
      totalScore: calculateTotalScore(),
      percentageScore: calculatePercentageScore(),
      weightedScore: calculateWeightedScore(),
      categoryScores: categories.reduce((acc, cat) => ({
        ...acc,
        [cat]: getCategoryScore(cat)
      }), {}),
      recommendations: getActionRecommendations()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `organizational-scorecard-${assessmentDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Statement ID', 'Category', 'Statement', 'Score', 'Notes', 'Priority'];
    const rows = statements.map(statement => [
      statement.id,
      statement.category,
      `"${statement.text}"`,
      scores[statement.id] || '',
      `"${notes[statement.id] || ''}"`,
      statement.priority
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `organizational-scorecard-${assessmentDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const percentage = calculatePercentageScore();
    const weightedPercentage = calculateWeightedScore();
    const interpretation = getScoreInterpretation(percentage);
    const recommendations = getActionRecommendations();
    
    let report = `ORGANIZATIONAL HEALTH SCORECARD REPORT\n`;
    report += `==========================================\n\n`;
    report += `Company: ${companyName}\n`;
    report += `Assessor: ${assessorName}\n`;
    if (selectedMember) report += `Team Member: ${selectedMember}\n`;
    report += `Assessment Date: ${assessmentDate}\n\n`;
    report += `OVERALL SCORE: ${percentage}% (${interpretation.level})\n`;
    report += `WEIGHTED SCORE: ${weightedPercentage}% (Priority-adjusted)\n\n`;
    
    report += `CATEGORY BREAKDOWN:\n`;
    report += `-------------------\n`;
    categories.forEach(category => {
      const categoryScore = getCategoryScore(category);
      const categoryInterpretation = getScoreInterpretation(categoryScore);
      report += `${category}: ${categoryScore}% (${categoryInterpretation.level})\n`;
    });
    
    report += `\nPRIORITY IMPROVEMENT AREAS:\n`;
    report += `---------------------------\n`;
    if (recommendations.length > 0) {
      recommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec.category} (${rec.score}%)\n`;
        rec.actions.forEach(action => {
          report += `   • ${action}\n`;
        });
        report += `\n`;
      });
    } else {
      report += `No immediate priority areas identified. Continue monitoring.\n\n`;
    }
    
    report += `\nDETAILED ASSESSMENT:\n`;
    report += `-------------------\n`;
    statements.forEach(statement => {
      const score = scores[statement.id] || 0;
      const note = notes[statement.id] || 'No notes';
      report += `\n${statement.id}. ${statement.text}\n`;
      report += `Score: ${score}/5 | Priority: ${statement.priority.toUpperCase()}\n`;
      report += `Notes: ${note}\n`;
    });
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `organizational-scorecard-report-${assessmentDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addTeamMember = () => {
    const name = prompt('Enter team member name:');
    if (name && name.trim()) {
      const newMember = { id: Date.now(), name: name.trim() };
      const updatedMembers = [...teamMembers, newMember];
      setTeamMembers(updatedMembers);
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    }
  };

  const importAssessment = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setCompanyName(data.companyName || '');
          setAssessorName(data.assessorName || '');
          setSelectedMember(data.selectedMember || '');
          setAssessmentDate(data.assessmentDate || new Date().toISOString().split('T')[0]);
          setScores(data.scores || {});
          setNotes(data.notes || {});
          alert('Assessment imported successfully!');
        } catch (error) {
          alert('Error importing assessment: Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const renderNavigation = () => (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => setCurrentView('assessment')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
          currentView === 'assessment' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <BarChart3 size={16} />
        Assessment
      </button>
      <button
        onClick={() => setCurrentView('history')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
          currentView === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Calendar size={16} />
        History ({savedAssessments.length})
      </button>
      <button
        onClick={() => setCurrentView('analytics')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
          currentView === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <TrendingUp size={16} />
        Analytics
      </button>
    </div>
  );

  const renderHistoryView = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Assessment History</h2>
      {savedAssessments.length === 0 ? (
        <p className="text-gray-600">No saved assessments found.</p>
      ) : (
        <div className="grid gap-4">
          {savedAssessments.map((assessment) => {
            const interpretation = getScoreInterpretation(assessment.percentageScore);
            return (
              <div key={assessment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{assessment.companyName}</h3>
                    <p className="text-sm text-gray-600">
                      {assessment.assessorName} • {assessment.assessmentDate}
                      {assessment.selectedMember && ` • ${assessment.selectedMember}`}
                    </p>
                    <div className={`inline-flex items-center gap-2 mt-2 px-2 py-1 rounded-full text-xs ${interpretation.bgColor} ${interpretation.color}`}>
                      <interpretation.icon size={12} />
                      {assessment.percentageScore}% - {interpretation.level}
                    </div>
                  </div>
                  <button
                    onClick={() => loadAssessment(assessment)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Load
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderAnalyticsView = () => {
    if (savedAssessments.length === 0) {
      return (
        <div className="text-center py-8">
          <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Complete and save assessments to see analytics</p>
        </div>
      );
    }

    const recommendations = getActionRecommendations();
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
        
        {recommendations.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              Priority Improvement Areas
            </h3>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border-l-4 border-yellow-400 pl-4">
                  <h4 className="font-medium text-yellow-900">{rec.category} ({rec.score}%)</h4>
                  <ul className="mt-2 space-y-1">
                    {rec.actions.map((action, i) => (
                      <li key={i} className="text-sm text-yellow-700">• {action}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Assessment Trend</h3>
            {savedAssessments.length > 1 ? (
              <div className="space-y-2">
                {savedAssessments.slice(-5).map((assessment, index) => (
                  <div key={assessment.id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{assessment.assessmentDate}</span>
                    <span className={`font-medium ${getScoreInterpretation(assessment.percentageScore).color}`}>
                      {assessment.percentageScore}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Need multiple assessments to show trends</p>
            )}
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
            <div className="space-y-3">
              {categories.map(category => {
                const score = getCategoryScore(category);
                const interpretation = getScoreInterpretation(score);
                return (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 flex-1">{category}</span>
                    <div className={`px-2 py-1 rounded text-xs ${interpretation.bgColor} ${interpretation.color}`}>
                      {score}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (currentView === 'history') return <div className="max-w-6xl mx-auto p-6 bg-white">{renderNavigation()}{renderHistoryView()}</div>;
  if (currentView === 'analytics') return <div className="max-w-6xl mx-auto p-6 bg-white">{renderNavigation()}{renderAnalyticsView()}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {renderNavigation()}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <BarChart3 className="text-blue-600" />
          Organizational Health Scorecard Agent
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assessor Name</label>
            <input
              type="text"
              value={assessorName}
              onChange={(e) => setAssessorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Users size={16} />
              Team Member (Optional)
            </label>
            <div className="flex gap-2">
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select team member</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.name}>{member.name}</option>
                ))}
              </select>
              <button
                onClick={addTeamMember}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                title="Add team member"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Assessment Date
            </label>
            <input
              type="date"
              value={assessmentDate}
              onChange={(e) => setAssessmentDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setShowResults(!showResults)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <TrendingUp size={16} />
            {showResults ? 'Hide Results' : 'Show Results'}
          </button>
          <button
            onClick={saveAssessment}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Save size={16} />
            Save Assessment
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Download size={16} />
            Export JSON
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            <FileText size={16} />
            Export CSV
          </button>
          <button
            onClick={generateReport}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <FileText size={16} />
            Generate Report
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer">
            <Upload size={16} />
            Import Assessment
            <input
              type="file"
              accept=".json"
              onChange={importAssessment}
              className="hidden"
            />
          </label>
        </div>

        {showResults && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 p-6 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{calculatePercentageScore()}%</div>
              <div className="text-gray-600">Overall Score</div>
              <div className={`text-sm font-medium ${getScoreInterpretation(calculatePercentageScore()).color}`}>
                {getScoreInterpretation(calculatePercentageScore()).level}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{calculateWeightedScore()}%</div>
              <div className="text-gray-600">Priority-Weighted</div>
              <div className="text-sm text-gray-500">Adjusted for priorities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{Object.keys(scores).length}</div>
              <div className="text-gray-600">Completed</div>
              <div className="text-sm text-gray-500">out of 20 total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{calculateTotalScore()}</div>
              <div className="text-gray-600">Raw Score</div>
              <div className="text-sm text-gray-500">Total points earned</div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category} className="border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{category}</h2>
              {showResults && (
                <div className={`text-lg font-bold ${getScoreInterpretation(getCategoryScore(category)).color}`}>
                  {getCategoryScore(category)}%
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {statements.filter(s => s.category === category).map(statement => (
                <div key={statement.id} className="border-l-4 border-blue-200 pl-4 py-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {statement.id}. {statement.text}
                      </span>
                    </div>
                    <div className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${
                      statement.priority === 'high' ? 'bg-red-100 text-red-800' :
                      statement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {statement.priority.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Score (1-5):</label>
                      <select
                        value={scores[statement.id] || ''}
                        onChange={(e) => handleScoreChange(statement.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Rate</option>
                        <option value="1">1 - Weak</option>
                        <option value="2">2 - Below Average</option>
                        <option value="3">3 - Average</option>
                        <option value="4">4 - Above Average</option>
                        <option value="5">5 - Strong</option>
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">Notes:</label>
                      <textarea
                        value={notes[statement.id] || ''}
                        onChange={(e) => handleNoteChange(statement.id, e.target.value)}
                        placeholder="Add notes, action items, or observations..."
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showResults && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Assessment Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(category => {
              const categoryScore = getCategoryScore(category);
              const interpretation = getScoreInterpretation(categoryScore);
              const Icon = interpretation.icon;
              
              return (
                <div key={category} className="flex items-start gap-3 p-4 bg-white rounded-lg">
                  <Icon className={`mt-1 ${interpretation.color}`} size={20} />
                  <div>
                    <div className="font-medium">{category}</div>
                    <div className={`text-sm ${interpretation.color}`}>
                      {categoryScore}% - {interpretation.level}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {categoryScore < 60 ? 
                        "Focus area for improvement - consider developing action plans" :
                        "Performing well - maintain current practices"
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {getActionRecommendations().length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={20} />
                Immediate Action Items
              </h4>
              <div className="space-y-3">
                {getActionRecommendations().slice(0, 3).map((rec, index) => (
                  <div key={index} className="border-l-4 border-amber-400 pl-3">
                    <div className="font-medium text-amber-900">{rec.category} ({rec.score}%)</div>
                    <ul className="mt-1 space-y-1">
                      {rec.actions.slice(0, 2).map((action, i) => (
                        <li key={i} className="text-sm text-amber-700">• {action}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationalScorecardAgent;
