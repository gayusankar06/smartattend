import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import HODDashboard from './pages/HODDashboard';
import PrincipalDashboard from './pages/PrincipalDashboard';
import QRScanner from './components/QRScanner';
import NotFound from './components/NotFound';

interface User {
  id: string;
  username: string;
  role: 'principal' | 'hod' | 'faculty' | 'student';
  name: string;
  department?: string;
  rollNo?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('smartattend_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('smartattend_user', JSON.stringify(userData));
    localStorage.setItem('smartattend_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('smartattend_user');
    localStorage.removeItem('smartattend_token');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} />
          <Route path="/scan" element={<QRScanner />} />
          <Route path="/404" element={<NotFound />} />
          
          <Route path="/" element={
            !user ? <Navigate to="/login" replace /> :
            user.role === 'principal' ? <Navigate to="/principal" replace /> :
            user.role === 'hod' ? <Navigate to="/hod" replace /> :
            user.role === 'faculty' ? <Navigate to="/faculty" replace /> :
            <Navigate to="/student" replace />
          } />
          
          <Route path="/principal" element={
            user?.role === 'principal' ? <PrincipalDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/hod" element={
            user?.role === 'hod' ? <HODDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/faculty" element={
            user?.role === 'faculty' ? <FacultyDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/student" element={
            user?.role === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          } />
          
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;