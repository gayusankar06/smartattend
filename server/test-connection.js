const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔗 Testing MongoDB Atlas connection...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Collections:', collections.map(c => c.name));
    
    mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ FAILED to connect:', error.message);
    console.log('Check:');
    console.log('1. Password in .env is correct');
    console.log('2. Network Access allows your IP');
    console.log('3. Cluster is running (status: green)');
    process.exit(1);
  }
}

testConnection();