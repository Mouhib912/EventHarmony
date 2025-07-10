import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, t('validation.minLength', { length: 8 }))
      .required(t('validation.required', { field: t('auth.password') })),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('validation.passwordMatch'))
      .required(t('validation.required', { field: t('auth.confirmPassword') })),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        await resetPassword(token, values.password);
        navigate('/login', { state: { passwordReset: true } });
      } catch (err) {
        setError(err.response?.data?.message || t('errors.unknown'));
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        {t('auth.resetPassword')}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label={t('auth.newPassword')}
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="new-password"
        autoFocus
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label={t('auth.confirmPassword')}
        type={showPassword ? 'text' : 'password'}
        id="confirmPassword"
        autoComplete="new-password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={formik.isSubmitting}
      >
        {t('auth.resetPassword')}
      </Button>
      
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

export default ResetPassword;