import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import { toast } from 'react-hot-toast';
import {
  LogOut, BarChart3, TrendingUp, TrendingDown, Users,
  AlertTriangle, Download, Mail, Calendar, Building,
  PieChart, Target, CheckCircle, XCircle, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HODDashboardProps {
  user: any;
  onLogout: () => void;
}

const HODDashboard: React.FC<HODDashboardProps> = ({ user, onLogout }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.hod();
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (attendance: number) => {
    if (attendance >= 85) return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
    if (attendance >= 75) return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
    return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
  };

  const departmentData = {
    'CSE': { totalStudents: 45, avgAttendance: 85, atRisk: 3 },
    'ECE': { totalStudents: 40, avgAttendance: 82, atRisk: 5 },
    'EEE': { totalStudents: 35, avgAttendance: 78, atRisk: 8 },
    'MECH': { totalStudents: 50, avgAttendance: 80, atRisk: 6 },
    'CIVIL': { totalStudents: 30, avgAttendance: 88, atRisk: 2 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg shadow-md">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">HOD Dashboard</h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  {user?.name} • {user?.department || 'CSE'} Department
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-2">
                <button className={`px-3 py-1 rounded-lg text-sm font-medium ${selectedPeriod === 'week' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setSelectedPeriod('week')}>
                  Week
                </button>
                <button className={`px-3 py-1 rounded-lg text-sm font-medium ${selectedPeriod === 'month' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setSelectedPeriod('month')}>
                  Month
                </button>
                <button className={`px-3 py-1 rounded-lg text-sm font-medium ${selectedPeriod === 'year' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setSelectedPeriod('year')}>
                  Year
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
        {/* Department Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-700">
                  {analytics?.totalStudents || 45}
                </div>
                <div className="text-sm text-green-600">Total Students</div>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-green-700 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2% from last month
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-700">
                  {analytics?.avgAttendance || 85}%
                </div>
                <div className="text-sm text-blue-600">Avg Attendance</div>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 text-xs text-blue-700 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3% improvement
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-700">
                  {analytics?.atRiskStudents?.length || 3}
                </div>
                <div className="text-sm text-yellow-600">At Risk Students</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-2 text-xs text-yellow-700 flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              2 less than last month
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-700">94%</div>
                <div className="text-sm text-purple-600">Target Achievement</div>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-purple-700 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              On track
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Department Comparison */}
          <div className="lg:col-span-2 card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-green-600" />
                Department Performance Comparison
              </h3>
              <div className="text-sm text-gray-500">Academic Year 2023-24</div>
            </div>
            <div className="space-y-4">
              {Object.entries(departmentData).map(([dept, data], index) => {
                const status = getStatusColor(data.avgAttendance);
                return (
                  <div key={dept} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${status.bg} flex items-center justify-center mr-3`}>
                        <span className={`font-bold ${status.text}`}>{dept.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-bold">{dept} Department</div>
                        <div className="text-sm text-gray-500">{data.totalStudents} students</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-lg ${status.text}`}>{data.avgAttendance}%</div>
                      <div className="text-xs text-gray-500">Attendance</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-red-600">{data.atRisk}</div>
                      <div className="text-xs text-gray-500">At Risk</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* At Risk Students */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                At Risk Students
              </h3>
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                {analytics?.atRiskStudents?.length || 3} Students
              </span>
            </div>
            <div className="space-y-4">
              {analytics?.atRiskStudents?.map((student: any, index: number) => (
                <div key={index} className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-red-700">{student.name}</div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      student.status === 'Critical' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {student.status}
                    </div>
                  </div>
                  <div className="text-sm text-red-600 mb-3">ID: {student.id} • Attendance: {student.attendance}%</div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium py-2 rounded">
                      <Mail className="w-3 h-3 inline mr-1" />
                      Email
                    </button>
                    <button className="flex-1 bg-white hover:bg-gray-100 text-red-700 text-xs font-medium py-2 rounded border border-red-300">
                      Call Parent
                    </button>
                  </div>
                </div>
              ))}
              {(!analytics?.atRiskStudents || analytics.atRiskStudents.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-300" />
                  <p>No at-risk students in your department</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Faculty Performance */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Faculty Performance Metrics
            </h3>
            <button className="text-blue-600 text-sm font-medium flex items-center">
              <Download className="w-4 h-4 mr-1" />
              Export Report
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Faculty</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Avg Attendance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Students</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Dr. Smith', subject: 'Data Structures', attendance: 92, students: 45, status: 'Excellent' },
                  { name: 'Prof. Johnson', subject: 'Algorithms', attendance: 88, students: 42, status: 'Good' },
                  { name: 'Dr. Williams', subject: 'Database Systems', attendance: 85, students: 40, status: 'Good' },
                  { name: 'Prof. Brown', subject: 'Computer Networks', attendance: 78, students: 38, status: 'Needs Improvement' },
                  { name: 'Dr. Davis', subject: 'Software Engineering', attendance: 91, students: 44, status: 'Excellent' }
                ].map((faculty, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{faculty.name}</div>
                      <div className="text-xs text-gray-500">Associate Professor</div>
                    </td>
                    <td className="py-3 px-4 font-medium">{faculty.subject}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${
                              faculty.attendance >= 90 ? 'bg-green-500' :
                              faculty.attendance >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${faculty.attendance}%` }}
                          ></div>
                        </div>
                        <span className="font-bold">{faculty.attendance}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{faculty.students}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        faculty.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                        faculty.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {faculty.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intervention Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-blue-800">Parent Communication</h4>
                <p className="text-sm text-blue-600">Send automated alerts</p>
              </div>
            </div>
            <p className="text-sm text-blue-700 mb-4">Send attendance reports to parents of at-risk students automatically.</p>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium">
              Send Batch Email
            </button>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-green-800">Remedial Classes</h4>
                <p className="text-sm text-green-600">Schedule extra sessions</p>
              </div>
            </div>
            <p className="text-sm text-green-700 mb-4">Organize special classes for students with attendance below 75%.</p>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium">
              Schedule Now
            </button>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-purple-800">Department Report</h4>
                <p className="text-sm text-purple-600">Generate comprehensive report</p>
              </div>
            </div>
            <p className="text-sm text-purple-700 mb-4">Create detailed department performance report for principal review.</p>
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Generate PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;