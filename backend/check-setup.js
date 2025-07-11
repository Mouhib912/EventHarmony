const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkSetup() {
  console.log('🔍 Checking EventHarmony backend setup...\n');

  // Check environment variables
  console.log('1. Checking environment variables:');
  const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'EMAIL_SERVICE',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
  ];

  let envOk = true;
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      console.log(`❌ Missing ${varName} in .env file`);
      envOk = false;
    }
  });

  if (envOk) {
    console.log('✅ All required environment variables are set');
  }

  // Check MongoDB connection
  console.log('\n2. Checking MongoDB connection:');
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Successfully connected to MongoDB');
  } catch (error) {
    console.log('❌ Failed to connect to MongoDB:');
    console.log(error.message);
    process.exit(1);
  }

  // Check if required npm packages are installed
  console.log('\n3. Checking required npm packages:');
  const requiredPackages = [
    'express',
    'mongoose',
    'cors',
    'dotenv',
    'jsonwebtoken',
    'bcryptjs',
    'nodemailer',
  ];

  try {
    requiredPackages.forEach(package => {
      require(package);
    });
    console.log('✅ All required packages are installed');
  } catch (error) {
    console.log(`❌ Missing package: ${error.message.split("'")[1]}`);
    console.log('Please run: npm install');
    process.exit(1);
  }

  await mongoose.disconnect();
  console.log('\n✨ Setup check completed! You can start the server with: npm start\n');
  process.exit(0);
}

checkSetup();
