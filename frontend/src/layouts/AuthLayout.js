import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import ThemeToggle from '../components/common/ThemeToggle';
import { useTranslation } from 'react-i18next';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Header with language and theme toggles */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
          gap: 2,
        }}
      >
        <LanguageSwitcher />
        <ThemeToggle />
      </Box>

      {/* Main content */}
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          {/* App logo and name */}
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {t('app.name')}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, textAlign: 'center' }}>
            {t('app.tagline')}
          </Typography>

          {/* Auth form content from the current route */}
          <Box sx={{ width: '100%' }}>
            <Outlet />
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} {t('app.name')}. {t('common.allRightsReserved')}
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthLayout;