import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionCode: {
    type: String,
    required: true,
    unique: true
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  professorName: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 60 // in seconds
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  location: String,
  attendees: [{
    studentId: String,
    studentName: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    method: {
      type: String,
      enum: ['qr', 'manual', 'geofence'],
      default: 'qr'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
sessionSchema.index({ professorId: 1, isActive: 1 });
sessionSchema.index({ sessionCode: 1 });
sessionSchema.index({ startTime: -1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;