const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Check if admin user exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      isVerified: true
    });

    console.log('Admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();
