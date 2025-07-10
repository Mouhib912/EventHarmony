import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('validation.required', { field: t('auth.name') })),
    email: Yup.string()
      .email(t('validation.email'))
      .required(t('validation.required', { field: t('auth.email') })),
    password: Yup.string()
      .min(8, t('validation.minLength', { length: 8 }))
      .required(t('validation.required', { field: t('auth.password') })),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('validation.passwordMatch'))
      .required(t('validation.required', { field: t('auth.confirmPassword') })),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        await register(values.name, values.email, values.password);
        navigate('/login', { state: { registered: true } });
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
        {t('auth.register')}
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
        id="name"
        label={t('auth.name')}
        name="name"
        autoComplete="name"
        autoFocus
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />
      
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
        autoComplete="new-password"
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
        {t('auth.register')}
      </Button>
      
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link to="/login" variant="body2">
            {t('auth.alreadyHaveAccount')}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;