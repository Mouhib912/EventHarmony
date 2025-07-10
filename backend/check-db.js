const mongoose = require('mongoose');
require('dotenv').config();

async function checkConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Successfully connected to MongoDB!');
    console.log('Connection URL:', process.env.MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkConnection();
