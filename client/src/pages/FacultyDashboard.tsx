import React, { useState, useEffect } from 'react';
import { sessionsAPI, analyticsAPI } from '../utils/api';
import { toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import {
  LogOut, QrCode, Users, Clock, BarChart3, Download,
  Mail, Bell, Calendar, UserPlus, MessageSquare, RefreshCw,
  CheckCircle, XCircle, TrendingUp, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FacultyDashboardProps {
  user: any;
  onLogout: () => void;
}

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ user, onLogout }) => {
  const [activeSession, setActiveSession] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [qrTimer, setQrTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [realTimeAttendees, setRealTimeAttendees] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeSession && qrTimer > 0) {
      timer = setInterval(() => {
        setQrTimer(prev => prev - 1);
      }, 1000);
    } else if (qrTimer === 0 && activeSession) {
      endSession();
    }
    return () => clearInterval(timer);
  }, [activeSession, qrTimer]);

  const loadAnalytics = async () => {
    try {
      const response = await analyticsAPI.faculty();
      setAnalytics(response.data);
      // Demo real-time attendees
      setRealTimeAttendees([
        { id: 'CS001', name: 'Alice Johnson', time: '09:02 AM', method: 'qr' },
        { id: 'CS002', name: 'Bob Smith', time: '09:05 AM', method: 'qr' },
        { id: 'CS003', name: 'Carol Davis', time: '09:07 AM', method: 'qr' },
      ]);
    } catch (error) {
      toast.error('Failed to load analytics');
    }
  };

  const startSession = async () => {
    try {
      setLoading(true);
      const className = prompt('Enter class name:', 'Data Structures - CS301') || 'Data Structures';
      const response = await sessionsAPI.start({ className });
      setActiveSession(response.data.session);
      setQrTimer(60);
      setRealTimeAttendees([]);
      toast.success('Session started! Share the QR code with students.');
    } catch (error) {
      toast.error('Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (!activeSession) return;
    setActiveSession(null);
    toast.success(`Session ended. ${realTimeAttendees.length} students marked present.`);
    loadAnalytics();
  };

  const refreshQR = () => {
    if (activeSession) {
      setQrTimer(60);
      toast.success('QR code refreshed for another 60 seconds');
    }
  };

  const markManualAttendance = () => {
    const name = prompt('Enter student name:');
    if (name) {
      setRealTimeAttendees(prev => [...prev, {
        id: `M${prev.length + 1}`,
        name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        method: 'manual'
      }]);
      toast.success(`${name} marked present manually`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Faculty Dashboard</h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Welcome, {user?.name} • {user?.department || 'CSE Department'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {activeSession && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-3 py-1 rounded-full">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 font-medium text-sm">Live Session Active</span>
                  </div>
                </div>
              )}
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
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-700">
                  {analytics?.classStats?.totalStudents || 45}
                </div>
                <div className="text-sm text-blue-600">Total Students</div>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-700">
                  {analytics?.classStats?.avgAttendance || 85}%
                </div>
                <div className="text-sm text-green-600">Avg Attendance</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-700">
                  {analytics?.classStats?.atRiskCount || 3}
                </div>
                <div className="text-sm text-yellow-600">At Risk</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-700">12</div>
                <div className="text-sm text-purple-600">Total Sessions</div>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* QR Session Section */}
        <div className="card mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <QrCode className="w-6 h-6 mr-2 text-blue-600" />
                Dynamic QR Attendance System
              </h3>
              <p className="text-gray-600 text-sm">Generate real-time QR codes for class attendance</p>
            </div>
            
            <div className="space-x-3">
              {!activeSession ? (
                <button
                  onClick={startSession}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{loading ? 'Starting...' : 'Start New Session'}</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={refreshQR}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh QR</span>
                  </button>
                  <button
                    onClick={endSession}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>End Session</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {activeSession ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* QR Code Section */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center">
                  <div className="inline-block bg-white p-4 rounded-xl shadow-lg">
                    <QRCodeSVG
                      value={JSON.stringify({
                        sessionCode: activeSession.sessionCode,
                        className: activeSession.className,
                        timestamp: Date.now(),
                        expiry: Date.now() + (qrTimer * 1000)
                      })}
                      size={256}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  
                  <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">60</div>
                      <div className="text-sm text-blue-700">Expected</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        {realTimeAttendees.length}
                      </div>
                      <div className="text-sm text-green-700">Present</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-red-600">
                        {60 - realTimeAttendees.length}
                      </div>
                      <div className="text-sm text-red-700">Pending</div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-center space-x-6">
                    <div className="bg-red-50 px-4 py-3 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-red-600" />
                        <span className="text-sm text-gray-600">Expires in: </span>
                        <span className="text-xl font-bold text-red-600">{qrTimer}s</span>
                      </div>
                    </div>
                    <div className="bg-green-50 px-4 py-3 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Class: </span>
                        <span className="font-bold text-green-700">{activeSession.className}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Attendance Feed */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-green-600" />
                  Live Attendance Feed
                </h4>
                <div className="space-y-3">
                  {realTimeAttendees.map((student, index) => (
                    <div key={index} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        student.method === 'qr' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {student.method === 'qr' ?
                          <CheckCircle className="w-4 h-4 text-green-600" /> :
                          <UserPlus className="w-4 h-4 text-blue-600" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-xs text-gray-500">ID: {student.id}</div>
                      </div>
                      <div className="text-sm text-gray-500">{student.time}</div>
                    </div>
                  ))}
                  
                  {realTimeAttendees.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <UserPlus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Waiting for students to scan QR...</p>
                    </div>
                  )}

                  <button
                    onClick={markManualAttendance}
                    className="w-full mt-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200 py-2 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Mark Attendance Manually</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <QrCode className="w-12 h-12 text-blue-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No Active Session</h4>
              <p className="text-gray-500 mb-6">Start a new session to generate QR code for attendance</p>
              <button
                onClick={startSession}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                Start New Session
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Performance */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Student Performance Overview
              </h3>
              <button className="text-blue-600 text-sm font-medium">View Details</button>
            </div>
            <div className="space-y-4">
              {analytics?.students?.map((student: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-3">
                      <span className="font-bold text-blue-700">{student.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-gray-500">ID: {student.id} • Marks: {student.marks}%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          student.attendance >= 90 ? 'bg-green-500' :
                          student.attendance >= 80 ? 'bg-blue-500' :
                          student.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                    <span className={`font-bold ${
                      student.attendance >= 90 ? 'text-green-600' :
                      student.attendance >= 80 ? 'text-blue-600' :
                      student.attendance >= 75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {student.attendance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                Quick Actions & Interventions
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-xl transition-all duration-200 hover:-translate-y-1">
                <Download className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-medium text-blue-700">Generate Report</span>
                <span className="text-xs text-blue-600 mt-1">Attendance Summary</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-xl transition-all duration-200 hover:-translate-y-1">
                <Mail className="w-8 h-8 text-green-600 mb-2" />
                <span className="font-medium text-green-700">Email Parents</span>
                <span className="text-xs text-green-600 mt-1">At-risk students</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-xl transition-all duration-200 hover:-translate-y-1">
                <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                <span className="font-medium text-purple-700">Schedule Class</span>
                <span className="text-xs text-purple-600 mt-1">Add extra sessions</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 rounded-xl transition-all duration-200 hover:-translate-y-1">
                <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                <span className="font-medium text-red-700">Counseling</span>
                <span className="text-xs text-red-600 mt-1">Low attendance</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;