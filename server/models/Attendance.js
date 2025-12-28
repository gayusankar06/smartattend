import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: ['qr', 'manual', 'geofence'],
    default: 'qr'
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    default: 'present'
  },
  location: {
    lat: Number,
    lng: Number
  },
  deviceInfo: {
    userAgent: String,
    platform: String
  },
  synced: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
attendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });
attendanceSchema.index({ studentId: 1, timestamp: -1 });
attendanceSchema.index({ sessionId: 1, timestamp: -1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;