// init-atlas.cjs - CommonJS version
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  console.log('📝 Add this to your .env file:');
  console.log('MONGODB_URI=mongodb+srv://smartattend_user:YOUR_PASSWORD@smartattend-cluster.mongodb.net/smartattend?retryWrites=true&w=majority');
  process.exit(1);
}

async function initializeAtlas() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    console.log('URI starts with:', MONGODB_URI.substring(0, 50) + '...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });
    
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
    // Clear existing data
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Cleared existing database');
    
    // Create users collection
    const usersCollection = mongoose.connection.db.collection('users');
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const users = [
      {
        username: 'principal',
        password: hashedPassword,
        role: 'principal',
        name: 'Dr. John Principal',
        email: 'principal@smartattend.edu',
        isActive: true,
        createdAt: new Date()
      },
      {
        username: 'hod',
        password: hashedPassword,
        role: 'hod',
        name: 'Prof. Sarah HOD',
        department: 'CSE',
        email: 'hod@smartattend.edu',
        isActive: true,
        createdAt: new Date()
      },
      {
        username: 'faculty',
        password: hashedPassword,
        role: 'faculty',
        name: 'Dr. Michael Faculty',
        department: 'CSE',
        email: 'faculty@smartattend.edu',
        isActive: true,
        createdAt: new Date()
      },
      {
        username: 'student',
        password: hashedPassword,
        role: 'student',
        name: 'Alice Johnson',
        rollNo: 'CS001',
        department: 'CSE',
        semester: 6,
        email: 'student@smartattend.edu',
        isActive: true,
        createdAt: new Date()
      }
    ];
    
    await usersCollection.insertMany(users);
    console.log(`✅ Inserted ${users.length} users`);
    
    // Create index
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    console.log('✅ Created index on username field');
    
    console.log('\n🎉 MongoDB Atlas initialized successfully!');
    console.log('\n🔐 LOGIN CREDENTIALS:');
    console.log('====================');
    console.log('Principal: principal / password123');
    console.log('HOD: hod / password123');
    console.log('Faculty: faculty / password123');
    console.log('Student: student / password123');
    
    console.log('\n🌐 Verify in Atlas Dashboard:');
    console.log('1. Go to https://cloud.mongodb.com');
    console.log('2. Click your cluster → Browse Collections');
    console.log('3. Click "users" collection to see data');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('\n🔐 AUTHENTICATION ISSUE:');
      console.log('1. Go to Atlas → Security → Database Access');
      console.log('2. Check username: smartattend_user');
      console.log('3. Reset password and update .env file');
    }
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('getaddrinfo')) {
      console.log('\n🌐 NETWORK ISSUE:');
      console.log('1. Go to Atlas → Security → Network Access');
      console.log('2. Click "Add IP Address"');
      console.log('3. Click "Allow Access From Anywhere"');
      console.log('4. Wait 1 minute and try again');
    }
    
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 Connection closed');
    }
    process.exit(0);
  }
}

initializeAtlas();