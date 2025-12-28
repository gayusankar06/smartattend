import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  name: String,
  department: String,
  rollNo: String,
  isActive: Boolean
});

const User = mongoose.model('User', userSchema);

async function initDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});

    // Create hashed passwords
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create users
    const users = [
      {
        username: 'principal',
        password: hashedPassword,
        role: 'principal',
        name: 'Dr. John Principal',
        isActive: true
      },
      {
        username: 'hod',
        password: hashedPassword,
        role: 'hod',
        name: 'Prof. Sarah HOD',
        department: 'CSE',
        isActive: true
      },
      {
        username: 'faculty',
        password: hashedPassword,
        role: 'faculty',
        name: 'Dr. Michael Faculty',
        department: 'CSE',
        isActive: true
      },
      {
        username: 'student',
        password: hashedPassword,
        role: 'student',
        name: 'Alice Johnson',
        department: 'CSE',
        rollNo: 'CS001',
        isActive: true
      }
    ];

    await User.insertMany(users);
    console.log('✅ Database initialized with users');
    console.log('Use: username: principal/password123, role: principal');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initDatabase();