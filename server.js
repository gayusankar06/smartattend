import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// In-memory database (no MongoDB setup required)
let users = [];
let sessions = [];
let students = [
  { id: 'CS001', name: 'Alice Johnson', department: 'CSE', attendance: 94, marks: 91 },
  { id: 'CS002', name: 'Bob Smith', department: 'CSE', attendance: 74, marks: 72 },
  { id: 'CS003', name: 'Carol Davis', department: 'CSE', attendance: 80, marks: 78 },
  { id: 'CS004', name: 'David Wilson', department: 'CSE', attendance: 69, marks: 65 },
  { id: 'EC001', name: 'Eva Brown', department: 'ECE', attendance: 88, marks: 85 },
  { id: 'EC002', name: 'Frank Miller', department: 'ECE', attendance: 92, marks: 88 },
  { id: 'EE001', name: 'Grace Lee', department: 'EEE', attendance: 85, marks: 82 },
  { id: 'IT001', name: 'Henry Taylor', department: 'IT', attendance: 91, marks: 89 },
  { id: 'ME001', name: 'Ivy Anderson', department: 'MECH', attendance: 78, marks: 75 }
];

const JWT_SECRET = process.env.JWT_SECRET || 'smartattend_jwt_secret_2024';

// Initialize demo data
async function initializeDemoData() {
  try {
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const demoUsers = [
        { id: '1', username: 'principal', password: hashedPassword, role: 'principal', name: 'Dr. Principal' },
        { id: '2', username: 'hod', password: hashedPassword, role: 'hod', name: 'Prof. HOD', department: 'CSE' },
        { id: '3', username: 'faculty', password: hashedPassword, role: 'faculty', name: 'Dr. Faculty', department: 'CSE' },
        { id: '4', username: 'student', password: hashedPassword, role: 'student', name: 'Alice Johnson', rollNo: 'CS001' },
        { id: '5', username: 'student2', password: hashedPassword, role: 'student', name: 'Bob Smith', rollNo: 'CS002' }
      ];
      
      users = demoUsers;
      console.log('✅ Demo users created in memory');
    }
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
}

// Generate unique session code
function generateSessionCode() {
  return `ATT-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    techStack: 'Node.js + Express + Socket.io',
    message: 'No MongoDB required - using in-memory storage'
  });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = users.find(u => u.username === username && u.role === role);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        name: user.name,
        department: user.department,
        rollNo: user.rollNo
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        department: user.department,
        rollNo: user.rollNo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start attendance session
app.post('/api/sessions/start', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Only faculty can start sessions' });
    }

    const { className } = req.body;
    const sessionCode = generateSessionCode();
    
    const qrCode = await QRCode.toDataURL(sessionCode);
    
    const session = {
      id: sessions.length + 1,
      sessionCode,
      professorId: req.user.id,
      professorName: req.user.name,
      className: className || 'Computer Science 101',
      qrCode,
      isActive: true,
      startTime: new Date(),
      attendees: []
    };
    
    sessions.push(session);
    
    res.json({
      success: true,
      session: session,
      qrCode: qrCode
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark attendance
app.post('/api/attendance/mark', async (req, res) => {
  try {
    const { sessionCode, studentId, studentName } = req.body;
    
    const session = sessions.find(s => s.sessionCode === sessionCode && s.isActive);
    if (!session) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }
    
    const alreadyMarked = session.attendees.some(att => att.studentId === studentId);
    if (alreadyMarked) {
      return res.json({ success: true, message: 'Attendance already marked' });
    }
    
    const attendanceRecord = {
      studentId,
      studentName: studentName || `Student ${studentId}`,
      timestamp: new Date(),
      method: 'qr'
    };
    
    session.attendees.push(attendanceRecord);
    
    // Real-time update
    io.emit('attendanceUpdate', {
      sessionCode,
      studentId,
      studentName: attendanceRecord.studentName,
      totalAttendees: session.attendees.length,
      timestamp: attendanceRecord.timestamp
    });
    
    res.json({ 
      success: true, 
      message: 'Attendance marked successfully',
      studentName: attendanceRecord.studentName
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics for principal
app.get('/api/analytics/principal', authenticateToken, (req, res) => {
  if (req.user.role !== 'principal') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const departments = ['CSE', 'ECE', 'EEE', 'IT', 'MECH'];
  const deptAnalytics = departments.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    const avgAttendance = deptStudents.length > 0 ? 
      Math.round(deptStudents.reduce((sum, s) => sum + s.attendance, 0) / deptStudents.length) : 0;
    const atRisk = deptStudents.filter(s => s.attendance < 75).length;
    
    return {
      department: dept,
      avgAttendance,
      atRiskStudents: atRisk,
      totalStudents: deptStudents.length,
      remark: avgAttendance >= 85 ? 'Excellent' : avgAttendance >= 75 ? 'Good' : 'Needs Improvement'
    };
  });

  res.json({ analytics: deptAnalytics });
});

// Get analytics for HOD
app.get('/api/analytics/hod', authenticateToken, (req, res) => {
  if (req.user.role !== 'hod') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const deptStudents = students.filter(s => s.department === req.user.department);
  const atRiskStudents = deptStudents.filter(s => s.attendance < 75);
  
  res.json({
    department: req.user.department,
    totalStudents: deptStudents.length,
    avgAttendance: Math.round(deptStudents.reduce((sum, s) => sum + s.attendance, 0) / deptStudents.length),
    atRiskStudents: atRiskStudents.map(s => ({
      id: s.id,
      name: s.name,
      attendance: s.attendance,
      status: s.attendance < 60 ? 'Critical' : s.attendance < 70 ? 'Warning' : 'Needs Counseling'
    }))
  });
});

// Get faculty data
app.get('/api/analytics/faculty', authenticateToken, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const facultyStudents = students.filter(s => s.department === req.user.department);
  
  res.json({
    students: facultyStudents,
    classStats: {
      totalStudents: facultyStudents.length,
      avgAttendance: Math.round(facultyStudents.reduce((sum, s) => sum + s.attendance, 0) / facultyStudents.length),
      avgMarks: Math.round(facultyStudents.reduce((sum, s) => sum + s.marks, 0) / facultyStudents.length),
      atRiskCount: facultyStudents.filter(s => s.attendance < 75).length
    }
  });
});

// Get student data
app.get('/api/analytics/student', authenticateToken, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const student = students.find(s => s.id === req.user.rollNo);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json({
    student,
    attendanceTrend: [88, 90, 85, 87, student.attendance],
    marksTrend: [82, 88, 85],
    subjectAttendance: [
      { subject: 'Cyber Security', attendance: 90 },
      { subject: 'IoT', attendance: 85 },
      { subject: 'Cloud Computing', attendance: 88 },
      { subject: 'Python', attendance: 92 },
      { subject: 'DSA', attendance: 87 }
    ]
  });
});

// Get active sessions
app.get('/api/sessions/active', authenticateToken, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const activeSessions = sessions.filter(s => s.professorId === req.user.id && s.isActive);
  res.json({ sessions: activeSessions });
});

// End session
app.post('/api/sessions/:sessionId/end', authenticateToken, (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.professorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    session.isActive = false;
    session.endTime = new Date();

    res.json({ success: true, message: 'Session ended successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('joinSession', (sessionCode) => {
    socket.join(sessionCode);
    console.log(`User ${socket.id} joined session ${sessionCode}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`🚀 SmartAttend Server running on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`🎯 Tech Stack: Node.js + Express + Socket.io`);
  console.log(`💾 Database: In-Memory (No MongoDB setup required)`);
  console.log(`🔑 Demo: username = role, password = password123`);
  await initializeDemoData();
});