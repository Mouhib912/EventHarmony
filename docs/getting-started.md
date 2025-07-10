# Getting Started with EventHarmony

This guide will help you set up and run EventHarmony on your local machine for development and testing purposes.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- MongoDB (v4 or higher)
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/eventharmony.git
cd eventharmony
```

### 2. Install Dependencies

Install all dependencies for the project (backend and frontend):

```bash
npm run install-all
```

Alternatively, you can install dependencies separately:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables

#### Backend Configuration

Create a `.env` file in the `backend` directory based on the `.env.example` file:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file to configure your environment variables, especially:

- MongoDB connection string
- JWT secret
- Email service credentials

#### Frontend Configuration

Create a `.env` file in the `frontend` directory based on the `.env.example` file:

```bash
cd ../frontend
cp .env.example .env
```

### 4. Start the Development Servers

From the root directory, run:

```bash
npm run dev
```

This will start both the backend and frontend development servers concurrently.

Alternatively, you can run them separately:

```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

### 5. Access the Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)

## Initial Setup

### Admin User

When you first run the application, an admin user will be created automatically with the credentials specified in your backend `.env` file:

```
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@eventharmony.com
ADMIN_PASSWORD=password123
```

You can use these credentials to log in to the application and start creating events, users, and more.

## Development Workflow

1. Create a new branch for your feature or bug fix
2. Make your changes
3. Run tests to ensure everything works as expected
4. Submit a pull request

## Available Scripts

- `npm run dev`: Start both backend and frontend development servers
- `npm run server`: Start only the backend server with nodemon
- `npm run client`: Start only the frontend development server
- `npm run build`: Build the frontend for production
- `npm start`: Start the production server

## Next Steps

- Check out the [Architecture Overview](./architecture-overview.md) to understand the project structure
- Explore the [API Documentation](./api-documentation.md) to learn about available endpoints
- Read the [Developer Guide](./developer-guide.md) for coding standards and best practices