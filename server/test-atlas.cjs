// test-atlas.cjs - CommonJS version
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔗 Testing MongoDB Atlas connection...');
    console.log('URI:', process.env.MONGODB_URI ? '✅ Found in .env' : '❌ Missing in .env');
    
    if (!process.env.MONGODB_URI) {
      console.log('❌ Please add MONGODB_URI to your .env file');
      console.log('Format: mongodb+srv://username:password@cluster.mongodb.net/database');
      process.exit(1);
    }
    
    // Check if URI has correct format
    const uri = process.env.MONGODB_URI;
    if (!uri.includes('mongodb+srv://')) {
      console.log('❌ Wrong URI format. Must start with mongodb+srv://');
      console.log('Current URI:', uri);
      process.exit(1);
    }
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    });
    
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ FAILED to connect:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Check password in .env is correct');
    console.log('2. Go to Atlas → Network Access → Add IP Address → Allow Access From Anywhere');
    console.log('3. Wait 1 minute after adding IP address');
    console.log('4. Check cluster status is "Active" in Atlas dashboard');
    console.log('5. Your MONGODB_URI should be:', process.env.MONGODB_URI);
    process.exit(1);
  }
}

testConnection();