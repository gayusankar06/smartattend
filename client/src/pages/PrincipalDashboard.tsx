import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import { toast } from 'react-hot-toast';
import {
  LogOut, Building, TrendingUp, TrendingDown, Users,
  AlertTriangle, Download, BarChart3, PieChart, Target,
  Award, CheckCircle, XCircle, Bell, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PrincipalDashboardProps {
  user: any;
  onLogout: () => void;
}

const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ user, onLogout }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.principal();
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const overallStats = {
    totalStudents: 200,
    totalFaculty: 25,
    avgInstitutionAttendance: 82,
    totalAtRisk: 24,
    departments: 6,
    achievementRate: 88
  };

  const performanceData = [
    { department: 'CSE', attendance: 85, atRisk: 3, trend: '+2%', status: 'good' },
    { department: 'ECE', attendance: 82, atRisk: 5, trend: '+1%', status: 'good' },
    { department: 'EEE', attendance: 78, atRisk: 8, trend: '-1%', status: 'warning' },
    { department: 'MECH', attendance: 80, atRisk: 4, trend: '+3%', status: 'good' },
    { department: 'CIVIL', attendance: 88, atRisk: 2, trend: '+2%', status: 'excellent' },
    { department: 'IT', attendance: 83, atRisk: 3, trend: '0%', status: 'good' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <nav className="bg-white shadow-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Principal Dashboard</h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                  Institution Overview • {user?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-2 bg-gray-100 p-1 rounded-lg">
                <button className={`px-3 py-1 rounded text-sm font-medium ${selectedView === 'overview' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
                  onClick={() => setSelectedView('overview')}>
                  Overview
                </button>
                <button className={`px-3 py-1 rounded text-sm font-medium ${selectedView === 'departments' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
                  onClick={() => setSelectedView('departments')}>
                  Departments
                </button>
                <button className={`px-3 py-1 rounded text-sm font-medium ${selectedView === 'reports' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
                  onClick={() => setSelectedView('reports')}>
                  Reports
                </button>
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={onLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Institution Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-700">{overallStats.totalStudents}</div>
              <div className="text-xs text-indigo-600">Total Students</div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">{overallStats.totalFaculty}</div>
              <div className="text-xs text-blue-600">Faculty</div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{overallStats.avgInstitutionAttendance}%</div>
              <div className="text-xs text-green-600">Avg Attendance</div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-700">{overallStats.totalAtRisk}</div>
              <div className="text-xs text-red-600">At Risk</div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">{overallStats.departments}</div>
              <div className="text-xs text-purple-600">Departments</div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-700">{overallStats.achievementRate}%</div>
              <div className="text-xs text-yellow-600">Target Met</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Department Performance */}
          <div className="lg:col-span-2 card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                Department Performance Dashboard
              </h3>
              <button className="text-indigo-600 text-sm font-medium flex items-center">
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
            <div className="space-y-4">
              {performanceData.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      dept.status === 'excellent' ? 'bg-gradient-to-br from-green-100 to-green-200' :
                      dept.status === 'good' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                      'bg-gradient-to-br from-yellow-100 to-yellow-200'
                    }`}>
                      <span className={`font-bold ${
                        dept.status === 'excellent' ? 'text-green-700' :
                        dept.status === 'good' ? 'text-blue-700' : 'text-yellow-700'
                      }`}>{dept.department.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-bold">{dept.department} Department</div>
                      <div className="text-sm text-gray-500">Dr. {['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller'][index]}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className={`text-xl font-bold ${
                        dept.attendance >= 85 ? 'text-green-600' :
                        dept.attendance >= 80 ? 'text-blue-600' : 'text-yellow-600'
                      }`}>
                        {dept.attendance}%
                      </div>
                      <div className="text-xs text-gray-500">Attendance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600">{dept.atRisk}</div>
                      <div className="text-xs text-gray-500">At Risk</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      dept.trend.startsWith('+') ? 'bg-green-100 text-green-800' :
                      dept.trend.startsWith('-') ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dept.trend.startsWith('+') ? <TrendingUp className="w-4 h-4 inline mr-1" /> :
                       dept.trend.startsWith('-') ? <TrendingDown className="w-4 h-4 inline mr-1" /> : '→'}
                      {dept.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Insights */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                Institutional Insights
              </h3>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-800">Top Performing</div>
                    <div className="text-xs text-green-600">Civil Engineering</div>
                  </div>
                </div>
                <p className="text-green-700 text-sm">
                  CIVIL department leads with 88% attendance and only 2 at-risk students.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="font-semibold text-yellow-800">Needs Attention</div>
                    <div className="text-xs text-yellow-600">EEE Department</div>
                  </div>
                </div>
                <p className="text-yellow-700 text-sm">
                  78% attendance with 8 at-risk students. Consider intervention strategies.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-800">Positive Trend</div>
                    <div className="text-xs text-blue-600">Overall Improvement</div>
                  </div>
                </div>
                <p className="text-blue-700 text-sm">
                  Institution attendance improved by 3% compared to last semester.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Required */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              Action Required - Critical Situations
            </h3>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
              3 Urgent Actions
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-red-300 rounded-lg bg-red-50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">!</span>
                </div>
                <div>
                  <div className="font-bold text-red-700">EEE Department</div>
                  <div className="text-xs text-red-600">8 at-risk students</div>
                </div>
              </div>
              <p className="text-sm text-red-700 mb-3">Attendance dropped to 78%. Immediate faculty meeting required.</p>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium">
                Schedule Meeting
              </button>
            </div>
            
            <div className="p-4 border border-yellow-300 rounded-lg bg-yellow-50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-yellow-700">Parent Communication</div>
                  <div className="text-xs text-yellow-600">24 students at risk</div>
                </div>
              </div>
              <p className="text-sm text-yellow-700 mb-3">Send consolidated report to parents of at-risk students.</p>
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium">
                Generate Report
              </button>
            </div>
            
            <div className="p-4 border border-blue-300 rounded-lg bg-blue-50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-blue-700">Quarterly Target Review</div>
                  <div className="text-xs text-blue-600">85% target</div>
                </div>
              </div>
              <p className="text-sm text-blue-700 mb-3">Current institution average: 82%. Review strategies to meet target.</p>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">
                Review Plan
              </button>
            </div>
          </div>
        </div>

        {/* Summary Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Attendance Trend</h3>
            <div className="flex items-end h-40 space-x-2">
              {[82, 83, 81, 84, 82, 85, 82].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-400 to-indigo-600 rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ height: `${value * 0.4}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-center">
                <Globe className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-indigo-700">Institution Report</div>
              </button>
              <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-center">
                <Download className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-green-700">Export Data</div>
              </button>
              <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-center">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-blue-700">Faculty Meeting</div>
              </button>
              <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-center">
                <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-purple-700">Set Targets</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;