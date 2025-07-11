import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './contexts/AuthContext';

// Layout components
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));

// Dashboard pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));

// Event pages
const EventsList = lazy(() => import('./pages/events/EventsList'));
const EventDetails = lazy(() => import('./pages/events/EventDetails'));
const CreateEvent = lazy(() => import('./pages/events/CreateEvent'));
const EditEvent = lazy(() => import('./pages/events/EditEvent'));
const EventParticipants = lazy(() => import('./pages/events/EventParticipants'));

// User pages
const Profile = lazy(() => import('./pages/users/Profile'));
const UsersList = lazy(() => import('./pages/users/UsersList'));

// Meeting pages
const B2BMeetings = lazy(() => import('./pages/meets/Meets'));
const OnlineMeetings = lazy(() => import('./pages/meetings/OnlineMeetings'));

// Error pages
const NotFound = lazy(() => import('./pages/errors/NotFound'));

// Loading component for Suspense
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Route>
        
        {/* Main app routes */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Events routes */}
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/create" element={
            <ProtectedRoute allowedRoles={['admin', 'product_owner', 'client']}>
              <CreateEvent />
            </ProtectedRoute>
          } />
          <Route path="/events/:id/edit" element={
            <ProtectedRoute allowedRoles={['admin', 'product_owner', 'client']}>
              <EditEvent />
            </ProtectedRoute>
          } />
          <Route path="/events/:id/participants" element={
            <ProtectedRoute allowedRoles={['admin', 'product_owner', 'client', 'staff']}>
              <EventParticipants />
            </ProtectedRoute>
          } />
          
          {/* Meeting routes */}
          <Route path="/meets" element={<B2BMeetings />} />
          <Route path="/online-meetings" element={<OnlineMeetings />} />
          
          {/* User routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['admin', 'product_owner']}>
              <UsersList />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;