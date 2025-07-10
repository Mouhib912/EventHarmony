import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const EditEvent = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('validation.required', { field: t('events.name') })),
    description: Yup.string()
      .required(t('validation.required', { field: t('events.description') })),
    date: Yup.string()
      .required(t('validation.required', { field: t('events.date') })),
    startTime: Yup.string()
      .required(t('validation.required', { field: t('events.startTime') })),
    endTime: Yup.string()
      .required(t('validation.required', { field: t('events.endTime') })),
    location: Yup.string()
      .required(t('validation.required', { field: t('events.location') })),
    address: Yup.string()
      .required(t('validation.required', { field: t('events.address') })),
    capacity: Yup.number()
      .required(t('validation.required', { field: t('events.capacity') }))
      .positive(t('validation.positive', { field: t('events.capacity') }))
      .integer(t('validation.integer', { field: t('events.capacity') })),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      address: '',
      capacity: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        
        // In a real application, this would be an API call
        // For now, we'll simulate the update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        navigate(`/events/${id}`, { state: { updated: true } });
      } catch (err) {
        setError(err.message || t('errors.unknown'));
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // In a real application, this would be an API call
        // For now, we'll simulate the data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockEvent = {
          id: parseInt(id),
          name: 'Tech Conference 2023',
          description: 'Join us for the biggest tech conference of the year. Network with industry leaders, attend workshops, and learn about the latest technologies.',
          date: '2023-12-15',
          startTime: '09:00',
          endTime: '18:00',
          location: 'New York Convention Center',
          address: '123 Main St, New York, NY 10001',
          capacity: 200,
          participants: 120,
          status: 'upcoming',
        };
        
        formik.setValues({
          name: mockEvent.name,
          description: mockEvent.description,
          date: mockEvent.date,
          startTime: mockEvent.startTime,
          endTime: mockEvent.endTime,
          location: mockEvent.location,
          address: mockEvent.address,
          capacity: mockEvent.capacity,
        });
      } catch (err) {
        setError(err.message || t('errors.unknown'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, t]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          to={`/events/${id}`}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          {t('events.backToDetails')}
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          {t('events.editEvent')}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t('events.name')}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label={t('events.description')}
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="date"
                  name="date"
                  label={t('events.date')}
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="startTime"
                  name="startTime"
                  label={t('events.startTime')}
                  type="time"
                  value={formik.values.startTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                  helperText={formik.touched.startTime && formik.errors.startTime}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="endTime"
                  name="endTime"
                  label={t('events.endTime')}
                  type="time"
                  value={formik.values.endTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                  helperText={formik.touched.endTime && formik.errors.endTime}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="location"
                  name="location"
                  label={t('events.location')}
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label={t('events.address')}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="capacity"
                  name="capacity"
                  label={t('events.capacity')}
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{t('events.participants')}</InputAdornment>,
                  }}
                  value={formik.values.capacity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                  helperText={formik.touched.capacity && formik.errors.capacity}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={formik.isSubmitting}
                >
                  {t('events.save')}
                </Button>
                <Button
                  component={Link}
                  to={`/events/${id}`}
                  sx={{ ml: 2 }}
                >
                  {t('common.cancel')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EditEvent;