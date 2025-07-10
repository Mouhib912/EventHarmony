import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('validation.email'))
      .required(t('validation.required', { field: t('auth.email') })),
    password: Yup.string()
      .required(t('validation.required', { field: t('auth.password') })),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        await login(values.email, values.password);
        navigate(from, { replace: true });
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
        {t('auth.login')}
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
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label={t('auth.password')}
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
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
      
      <FormControlLabel
        control={
          <Checkbox
            name="rememberMe"
            color="primary"
            checked={formik.values.rememberMe}
            onChange={formik.handleChange}
          />
        }
        label={t('auth.rememberMe')}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? t('common.loading') : t('auth.signIn')}
      </Button>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary">
              {t('auth.forgotPassword')}?
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary">
              {t('auth.dontHaveAccount')} {t('auth.signUp')}
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;