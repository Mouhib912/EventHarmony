import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const { token } = useParams();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        setIsLoading(true);
        setError('');
        await verifyEmail(token);
        setSuccess(true);
      } catch (err) {
        setError(err.response?.data?.message || t('errors.unknown'));
      } finally {
        setIsLoading(false);
      }
    };

    verifyUserEmail();
  }, [token, verifyEmail, t]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography component="h1" variant="h5" gutterBottom>
        {t('auth.emailVerification')}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('auth.emailVerified')}
        </Alert>
      )}
      
      <Button
        component={Link}
        to="/login"
        variant="contained"
        sx={{ mt: 2 }}
      >
        {t('auth.proceedToLogin')}
      </Button>
    </Box>
  );
};

export default VerifyEmail;