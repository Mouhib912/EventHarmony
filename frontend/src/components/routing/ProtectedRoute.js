import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ProtectedRoute = ({ requiredRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t('common.loading')}
        </Typography>
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are required, check if user has at least one of the required roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => user.roles?.includes(role));
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page or dashboard
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If authenticated and has required roles (if any), render the protected content
  return <Outlet />;
};

export default ProtectedRoute;