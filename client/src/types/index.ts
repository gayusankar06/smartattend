export interface User {
  id: string;
  username: string;
  role: 'principal' | 'hod' | 'faculty' | 'student';
  name: string;
  department?: string;
  rollNo?: string;
}

export interface Session {
  id: string;
  sessionCode: string;
  className: string;
  qrCode: string;
  isActive: boolean;
  startTime: Date;
  attendees: Array<{
    studentId: string;
    studentName: string;
    timestamp: Date;
  }>;
}

export interface StudentData {
  id: string;
  name: string;
  attendance: number;
  marks: number;
}