import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Grid,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('validation.email'))
      .required(t('validation.required', { field: t('auth.email') })),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        await forgotPassword(values.email);
        setSuccess(true);
      } catch (err) {
        setError(err.response?.data?.message || t('errors.unknown'));
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        {t('auth.forgotPassword')}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('auth.resetLinkSent')}
        </Alert>
      ) : (
        <>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t('auth.forgotPasswordInstructions')}
          </Typography>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('auth.email')}
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            {t('auth.sendResetLink')}
          </Button>
        </>
      )}
      
      <Grid container justifyContent="center">
        <Grid item>
          <Link to="/login" variant="body2">
            {t('auth.backToLogin')}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForgotPassword;