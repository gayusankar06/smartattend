import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import { toast } from 'react-hot-toast';
import {
  LogOut, QrCode, TrendingUp, BookOpen, Clock,
  Calendar, Award, TrendingDown, Bell, Download,
  BarChart, Users, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudentDashboardProps {
  user: any;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.student();
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const attendanceStatus = (attendance: number) => {
    if (attendance >= 90) return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (attendance >= 80) return { text: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (attendance >= 75) return { text: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: 'At Risk', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Student Dashboard</h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Welcome back, {user?.name} • {user?.rollNo}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/scan')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan QR</span>
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={onLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-700">
                  {analytics?.student?.attendance || 94}%
                </div>
                <div className="text-sm text-green-600">Overall Attendance</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-4 text-xs text-green-700 font-medium px-2 py-1 bg-green-200 rounded-full inline-block">
              {attendanceStatus(analytics?.student?.attendance || 94).text}
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-700">
                  {analytics?.student?.marks || 91}%
                </div>
                <div className="text-sm text-blue-600">Average Marks</div>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-700">A+</div>
                <div className="text-sm text-purple-600">Current Grade</div>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-700">12</div>
                <div className="text-sm text-yellow-600">Classes This Week</div>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Subject-wise Performance */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Subject-wise Performance
              </h3>
              <button className="text-blue-600 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {analytics?.subjectAttendance?.map((subject: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <div className="font-medium">{subject.subject}</div>
                    <div className="text-xs text-gray-500">Prof. {['Smith', 'Johnson', 'Williams'][index]}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          subject.attendance >= 90 ? 'bg-green-500' :
                          subject.attendance >= 80 ? 'bg-blue-500' :
                          subject.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${subject.attendance}%` }}
                      ></div>
                    </div>
                    <span className={`font-bold ${
                      subject.attendance >= 90 ? 'text-green-600' :
                      subject.attendance >= 80 ? 'text-blue-600' :
                      subject.attendance >= 75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {subject.attendance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                AI Insights & Recommendations
              </h3>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">Excellent Progress!</div>
                    <div className="text-xs text-green-600">Based on your performance</div>
                  </div>
                </div>
                <p className="text-green-700 text-sm">
                  Your attendance is 12% above class average. You&apos;re on track for academic excellence!
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">Study Recommendation</div>
                    <div className="text-xs text-blue-600">Optimize your schedule</div>
                  </div>
                </div>
                <p className="text-blue-700 text-sm">
                  Attend morning classes more regularly. Morning sessions show 25% better retention.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-purple-800">Peer Comparison</div>
                    <div className="text-xs text-purple-600">You&apos;re in top 15%</div>
                  </div>
                </div>
                <p className="text-purple-700 text-sm">
                  You rank 6th out of 45 students. Consider joining study groups to maintain performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-indigo-600" />
              Attendance Trend (Last 5 Weeks)
            </h3>
            <button className="text-blue-600 text-sm font-medium flex items-center">
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
          <div className="flex items-end h-48 space-x-2 px-4">
            {analytics?.attendanceTrend?.map((value: number, index: number) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 group-hover:shadow-lg ${
                    value >= 90 ? 'bg-gradient-to-t from-green-400 to-green-500' :
                    value >= 80 ? 'bg-gradient-to-t from-blue-400 to-blue-500' :
                    'bg-gradient-to-t from-yellow-400 to-yellow-500'
                  }`}
                  style={{ height: `${value * 0.4}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {value}%
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2 font-medium">Week {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="card">
            <h4 className="font-bold text-gray-700 mb-4">Today&apos;s Classes</h4>
            <div className="space-y-3">
              {['Data Structures (9:00 AM)', 'Algorithms (11:00 AM)', 'Database Systems (2:00 PM)'].map((cls, i) => (
                <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{cls}</div>
                    <div className="text-xs text-gray-500">Room {['A-101', 'B-202', 'C-303'][i]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h4 className="font-bold text-gray-700 mb-4">Attendance Alerts</h4>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div className="font-medium text-green-700">On track for scholarship</div>
                </div>
                <p className="text-green-600 text-sm mt-1">Maintain {'>'}90% attendance</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <div className="font-medium text-yellow-700">Database attendance: 85%</div>
                </div>
                <p className="text-yellow-600 text-sm mt-1">Aim for 90% this week</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h4 className="font-bold text-gray-700 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-center">
                <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center bg-blue-100 rounded">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-blue-700">Schedule</div>
              </button>
              <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-center">
                <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center bg-green-100 rounded">
                  <Download className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-sm font-medium text-green-700">Report</div>
              </button>
              <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-center">
                <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center bg-purple-100 rounded">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-purple-700">Counseling</div>
              </button>
              <button className="p-3 bg-red-50 hover:bg-red-100 rounded-lg text-center">
                <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center bg-red-100 rounded">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-sm font-medium text-red-700">Support</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;