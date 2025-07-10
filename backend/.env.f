# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/eventharmony

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Email Configuration (for password reset, notifications, etc.)
EMAIL_SERVICE=gmail
EMAIL_USER=mouhibchatti91@gmail.com
EMAIL_PASSWORD=Oldfriend123
EMAIL_FROM=mouhibchatti91@gmail.com
EMAIL_FROM_NAME=EventHarmony

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_UPLOAD=5000000 # 5MB in bytes
FILE_UPLOAD_PATH=./public/uploads

# QR Code Configuration
QR_CODE_ERROR_CORRECTION_LEVEL=M
QR_CODE_TYPE=svg

# Admin User (for seeding database)
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@eventharmony.com
ADMIN_PASSWORD=password123

# Rate Limiting
RATE_LIMIT_WINDOW_MS=15 # 15 minutes
RATE_LIMIT_MAX=100 # 100 requests per window