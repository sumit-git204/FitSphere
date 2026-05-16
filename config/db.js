const mongoose = require('mongoose');

async function connectDB() {
  //const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitsphere';
  const mongoUri = process.env.MONGO_URI;

  try {
    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${mongoUri}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
