import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { CheckCircle, AlertCircle, Award, Zap, ArrowUp, Book, Code, Terminal } from 'lucide-react';
import mockDashboardData from '../Constants/dummySummary';
import './dashboard.css';

export default function AssessmentDashboard() {
  const { key } = useParams();
  const mockTestcaseData = {
    "success": true,
    "summary": [
      "PASS src/tests/TodoInput.test.js",
      "PASS src/tests/TodoList.test.js"
    ],
    "stats": {
      "passedSuites": 2,
      "totalSuites": 2,
      "passedTests": 6,
      "totalTests": 6,
      "snapshots": 0,
      "time": "3.041 s"
    }
  };

  const dashboardData = JSON.parse(localStorage.getItem(`testSummary${key}`)) || mockDashboardData;
  const testcaseData = JSON.parse(localStorage.getItem(`testcaseData${key}`)) || mockTestcaseData;

  const [activeTab, setActiveTab] = useState('overview');
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const ScoreGauge = ({ score, size = 160, thickness = 15 }) => {
    const radius = size / 2;
    const innerRadius = radius - thickness;
    const circumference = 2 * Math.PI * innerRadius;
    const strokeDashoffset = circumference * (1 - score / 100);
    
    // Determine color based on score
    let color = '#22c55e'; // green for high scores
    if (score < 50) color = '#ef4444'; // red for low scores
    else if (score < 75) color = '#f59e0b'; // amber for medium scores
    
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={thickness}
          />
          <circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">{score}</span>
          <span className="text-sm text-gray-500">out of 100</span>
        </div>
      </div>
    );
  };
  
  const Card = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-700 mb-3">{title}</h3>
      {children}
    </div>
  );
  
  const StatItem = ({ icon, label, value, color = "text-blue-500" }) => {
    const Icon = icon;
    return (
      <div className="flex items-center p-2 border-b border-gray-100 last:border-0">
        <div className={`p-2 rounded-full ${color.replace('500', '100')} mr-3`}>
          <Icon size={20} className={color.replace('500', '600')} />
        </div>
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="font-medium">{value}</div>
        </div>
      </div>
    );
  };
  
  const OverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card title="Overall Assessment" className="flex flex-col items-center justify-center lg:col-span-1">
        <ScoreGauge score={dashboardData.overallScore} />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Overall performance across all criteria</p>
        </div>
      </Card>
      
      <Card title="Category Scores" className="lg:col-span-2">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData.categoryScores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {dashboardData.categoryScores.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card title="Test Results" className="lg:col-span-1">
        <div className="mb-4 flex justify-center">
          <div className="relative w-32 h-32">
            <PieChart width={130} height={130}>
              <Pie
                data={[
                  { name: 'Passed', value: testcaseData.stats.passedTests },
                  { name: 'Failed', value: testcaseData.stats.totalTests - testcaseData.stats.passedTests }
                ]}
                cx={65}
                cy={65}
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs text-gray-500">Pass Rate</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <StatItem 
            icon={CheckCircle} 
            label="Test Suites" 
            value={`${testcaseData.stats.passedSuites}/${testcaseData.stats.totalSuites} passed`} 
            color="text-green-500" 
          />
          <StatItem 
            icon={Zap} 
            label="Total Time" 
            value={testcaseData.stats.time} 
            color="text-amber-500" 
          />
        </div>
      </Card>
      
      <Card title="Learning Progress" className="lg:col-span-2">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardData.learningProgress.TimeProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="progress" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card title="Requirements Completion" className="flex flex-col">
        <div className="mb-4 flex justify-center">
          <div className="relative w-32 h-32">
            <PieChart width={130} height={130}>
              <Pie
                data={[
                  { name: 'Completed', value: dashboardData.functionalRequirements.completionPercentage },
                  { name: 'Remaining', value: 100 - dashboardData.functionalRequirements.completionPercentage }
                ]}
                cx={65}
                cy={65}
                innerRadius={40}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                dataKey="value"
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">{dashboardData.functionalRequirements.completionPercentage}%</div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto text-sm">
          <div className="mb-2">
            <div className="font-medium text-gray-700 mb-1">Completed:</div>
            <ul className="list-disc pl-5 text-green-600">
              {dashboardData.functionalRequirements.fulfilledRequirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-medium text-gray-700 mb-1">Missing:</div>
            <ul className="list-disc pl-5 text-red-600">
              {dashboardData.functionalRequirements.missedRequirements.slice(0, 3).map((req, i) => (
                <li key={i}>{req}</li>
              ))}
              {dashboardData.functionalRequirements.missedRequirements.length > 3 && (
                <li className="text-gray-500">+{dashboardData.functionalRequirements.missedRequirements.length - 3} more</li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
  
  const CodeQualityTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card title="Code Quality Score" className="lg:col-span-1 flex flex-col items-center justify-center">
        <ScoreGauge score={dashboardData.codeQuality.score} />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">Based on industry best practices</p>
        </div>
      </Card>
      
      <Card title="Strengths & Improvements" className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-green-600 font-medium mb-2 flex items-center">
              <CheckCircle size={16} className="mr-1" /> Strengths
            </h4>
            <ul className="space-y-2">
              {dashboardData.codeQuality.strengths.map((strength, i) => (
                <li key={i} className="flex">
                  <div className="mr-2 text-green-500">✓</div>
                  <div className="text-sm">{strength}</div>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-amber-600 font-medium mb-2 flex items-center">
              <AlertCircle size={16} className="mr-1" /> Improvements
            </h4>
            <ul className="space-y-2">
              {dashboardData.codeQuality.improvements.map((improvement, i) => (
                <li key={i} className="flex">
                  <div className="mr-2 text-amber-500">⚠</div>
                  <div className="text-sm">{improvement}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
      
      <Card title="Performance Insights" className="lg:col-span-2">
        <div className="mb-4">
          <div className="font-medium text-gray-700 mb-1">Code Efficiency Score: {dashboardData.performanceInsights.codeEfficiency}/100</div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div 
              className="h-2 rounded-full bg-blue-500" 
              style={{ width: `${dashboardData.performanceInsights.codeEfficiency}%` }} 
            />
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData.performanceInsights.performanceMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card title="Skills Radar" className="lg:col-span-1">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={80} data={dashboardData.skillRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Skills"
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
  
  const LearningTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card title="Learning Progress" className="lg:col-span-1 flex flex-col items-center justify-center">
        <ScoreGauge score={dashboardData.learningProgress.progressIndicator} />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">Overall learning completion</p>
        </div>
      </Card>
      
      <Card title="Time Progress Trend" className="lg:col-span-2">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardData.learningProgress.TimeProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="progress" 
                stroke="#8884d8" 
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card title="Skills Learned" className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData.learningProgress.skillsLearned.map((skill, i) => (
            <div key={i} className="flex items-center bg-blue-50 rounded-lg p-3">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <Book size={18} className="text-blue-600" />
              </div>
              <div className="text-sm">{skill}</div>
            </div>
          ))}
        </div>
      </Card>
      
      <Card title="AI Interaction Quality" className="lg:col-span-1">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData.aiInteractionSummary.interactionScores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {dashboardData.aiInteractionSummary.interactionScores.map((entry, index) => {
                  let color = '#22c55e';
                  if (entry.score < 50) color = '#ef4444';
                  else if (entry.score < 75) color = '#f59e0b';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2">
          <div className="text-sm text-gray-500">Total Prompts: {dashboardData.aiInteractionSummary.totalPrompts}</div>
        </div>
      </Card>
    </div>
  );
  
  const RecommendationsTab = () => (
    <div className="grid grid-cols-1 gap-4">
      <Card title="Recommendations for Improvement">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData.recommendations.map((recommendation, i) => (
            <div key={i} className="flex">
              <div className="mr-3 mt-1">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {i + 1}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Next Steps">
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <ArrowUp size={16} className="text-green-600" />
              </div>
              <div className="text-sm">
                <span className="font-medium">Complete CRUD operations</span>
                <p className="text-gray-500 mt-1">Implement edit, delete, and mark as completed functionality</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <Code size={16} className="text-blue-600" />
              </div>
              <div className="text-sm">
                <span className="font-medium">Learn advanced React patterns</span>
                <p className="text-gray-500 mt-1">Focus on useReducer, Context API, and optimization techniques</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full mr-3">
                <Terminal size={16} className="text-purple-600" />
              </div>
              <div className="text-sm">
                <span className="font-medium">Improve test coverage</span>
                <p className="text-gray-500 mt-1">Write more comprehensive tests covering edge cases</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card title="Learning Resources">
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-3 py-1">
              <h4 className="font-medium">Advanced React Hooks</h4>
              <p className="text-sm text-gray-500">Master useReducer, useCallback and React.memo for optimization</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-3 py-1">
              <h4 className="font-medium">Local Storage Persistence</h4>
              <p className="text-sm text-gray-500">Learn how to persist application state across browser sessions</p>
            </div>
            
            <div className="border-l-4 border-amber-500 pl-3 py-1">
              <h4 className="font-medium">Responsive UI Design</h4>
              <p className="text-sm text-gray-500">Techniques for creating interfaces that work on all devices</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-3 py-1">
              <h4 className="font-medium">Advanced React Testing</h4>
              <p className="text-sm text-gray-500">Strategies for testing complex components and interactions</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Assessment Dashboard</h1>
          <p className="text-gray-500">React Todo App Project Evaluation</p>
        </header>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex items-center justify-center">
              <ScoreGauge score={dashboardData.overallScore} size={120} thickness={10} />
            </div>
            
            <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <StatItem 
                icon={Award}
                label="Code Quality" 
                value={`${dashboardData.codeQuality.score}/100`} 
                color="text-blue-500" 
              />
              <StatItem 
                icon={CheckCircle} 
                label="Test Coverage" 
                value="100%" 
                color="text-green-500" 
              />
              <StatItem 
                icon={Book} 
                label="Learning Progress" 
                value={`${dashboardData.learningProgress.progressIndicator}%`} 
                color="text-purple-500" 
              />
              <StatItem 
                icon={Terminal} 
                label="Requirements Met" 
                value={`${dashboardData.functionalRequirements.completionPercentage}%`} 
                color="text-amber-500" 
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1 min-w-full">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'overview' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('codeQuality')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'codeQuality' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Code Quality
            </button>
            <button 
              onClick={() => setActiveTab('learning')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'learning' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Learning Progress
            </button>
            <button 
              onClick={() => setActiveTab('recommendations')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'recommendations' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Recommendations
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'codeQuality' && <CodeQualityTab />}
          {activeTab === 'learning' && <LearningTab />}
          {activeTab === 'recommendations' && <RecommendationsTab />}
        </div>
      </div>
    </div>
  );
}