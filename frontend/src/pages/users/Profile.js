import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Lock as LockIcon,
  Event as EventIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // In a real application, this would be an API call
        // For now, we'll simulate the data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock profile data
        const mockProfile = {
          id: user.id,
          firstName: 'John',
          lastName: 'Doe',
          email: user.email,
          phone: '+1 (555) 123-4567',
          jobTitle: 'Software Engineer',
          organization: 'Tech Solutions Inc.',
          bio: 'Passionate about technology and event planning. Love to connect people and create memorable experiences.',
          avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
          joinedAt: '2023-01-15T10:30:00Z',
          lastLogin: '2023-09-20T08:45:00Z',
        };
        
        // Mock user events
        const mockEvents = [
          { id: 1, name: 'Tech Conference 2023', date: '2023-12-15', role: 'organizer', status: 'upcoming' },
          { id: 2, name: 'Product Launch', date: '2023-10-05', role: 'participant', status: 'upcoming' },
          { id: 3, name: 'Team Building Workshop', date: '2023-08-20', role: 'organizer', status: 'past' },
          { id: 4, name: 'Annual Company Retreat', date: '2023-07-10', role: 'participant', status: 'past' },
        ];
        
        setProfileData(mockProfile);
        setUserEvents(mockEvents);
      } catch (err) {
        setError(err.message || t('errors.unknown'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, t]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleProfileUpdate = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccess('');
      
      // Update profile using the auth context function
      await updateProfile(values);
      
      // Update the local state
      setProfileData({ ...profileData, ...values });
      
      setSuccess(t('profile.updateSuccess'));
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.message || t('errors.unknown'));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (values, { setSubmitting, resetForm }) => {
    try {
      setError('');
      setSuccess('');
      
      // Update password using the auth context function
      await updatePassword(values.newPassword);
      
      setSuccess(t('profile.passwordUpdateSuccess'));
      setOpenSnackbar(true);
      handleClosePasswordDialog();
      resetForm();
    } catch (err) {
      setError(err.message || t('errors.unknown'));
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          {error || t('profile.notFound')}
        </Alert>
      </Container>
    );
  }

  const profileValidationSchema = Yup.object({
    firstName: Yup.string().required(t('validation.required')),
    lastName: Yup.string().required(t('validation.required')),
    email: Yup.string().email(t('validation.email')).required(t('validation.required')),
    phone: Yup.string(),
    jobTitle: Yup.string(),
    organization: Yup.string(),
    bio: Yup.string().max(500, t('validation.maxLength', { length: 500 })),
  });

  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required(t('validation.required')),
    newPassword: Yup.string()
      .min(8, t('validation.passwordMin'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        t('validation.passwordComplexity'),
      )
      .required(t('validation.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], t('validation.passwordMatch'))
      .required(t('validation.required')),
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('profile.title')}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<PersonIcon />} label={t('profile.personalInfo')} />
            <Tab icon={<EventIcon />} label={t('profile.myEvents')} />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    src={profileData.avatarUrl}
                    alt={`${profileData.firstName} ${profileData.lastName}`}
                    sx={{ width: 100, height: 100, mr: 3 }}
                  />
                  <Box>
                    <Typography variant="h5">
                      {profileData.firstName} {profileData.lastName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {profileData.jobTitle} {profileData.organization ? `at ${profileData.organization}` : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('profile.memberSince')}: {formatDate(profileData.joinedAt)}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      {t('profile.changePhoto')}
                    </Button>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                <Formik
                  initialValues={{
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    email: profileData.email,
                    phone: profileData.phone || '',
                    jobTitle: profileData.jobTitle || '',
                    organization: profileData.organization || '',
                    bio: profileData.bio || '',
                  }}
                  validationSchema={profileValidationSchema}
                  onSubmit={handleProfileUpdate}
                >
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="firstName"
                            name="firstName"
                            label={t('profile.firstName')}
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.firstName && Boolean(errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="lastName"
                            name="lastName"
                            label={t('profile.lastName')}
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label={t('profile.email')}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="phone"
                            name="phone"
                            label={t('profile.phone')}
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.phone && Boolean(errors.phone)}
                            helperText={touched.phone && errors.phone}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="jobTitle"
                            name="jobTitle"
                            label={t('profile.jobTitle')}
                            value={values.jobTitle}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.jobTitle && Boolean(errors.jobTitle)}
                            helperText={touched.jobTitle && errors.jobTitle}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="organization"
                            name="organization"
                            label={t('profile.organization')}
                            value={values.organization}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.organization && Boolean(errors.organization)}
                            helperText={touched.organization && errors.organization}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            id="bio"
                            name="bio"
                            label={t('profile.bio')}
                            value={values.bio}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.bio && Boolean(errors.bio)}
                            helperText={touched.bio && errors.bio}
                            multiline
                            rows={4}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                              variant="outlined"
                              startIcon={<LockIcon />}
                              onClick={handleOpenPasswordDialog}
                            >
                              {t('profile.changePassword')}
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<SaveIcon />}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <CircularProgress size={24} />
                              ) : (
                                t('common.save')
                              )}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Formik>
              </Box>
            )}
            
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t('profile.eventsParticipating')}
                </Typography>
                
                {userEvents.length > 0 ? (
                  <Grid container spacing={3}>
                    {userEvents.map((event) => (
                      <Grid item xs={12} sm={6} md={4} key={event.id}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" component="div">
                              {event.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {formatDate(event.date)}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Typography variant="body2">
                                {t(`profile.role${event.role.charAt(0).toUpperCase() + event.role.slice(1)}`)}
                              </Typography>
                              <Button
                                component={Link}
                                to={`/events/${event.id}`}
                                size="small"
                                variant="outlined"
                              >
                                {t('common.view')}
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    {t('profile.noEvents')}
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
      
      {/* Password Change Dialog */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
        <DialogTitle>{t('profile.changePassword')}</DialogTitle>
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          validationSchema={passwordValidationSchema}
          onSubmit={handlePasswordUpdate}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                  {t('profile.passwordDialogText')}
                </DialogContentText>
                <TextField
                  fullWidth
                  margin="dense"
                  id="currentPassword"
                  name="currentPassword"
                  label={t('profile.currentPassword')}
                  type="password"
                  value={values.currentPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.currentPassword && Boolean(errors.currentPassword)}
                  helperText={touched.currentPassword && errors.currentPassword}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  id="newPassword"
                  name="newPassword"
                  label={t('profile.newPassword')}
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.newPassword && Boolean(errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  id="confirmPassword"
                  name="confirmPassword"
                  label={t('profile.confirmPassword')}
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePasswordDialog}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    t('common.save')
                  )}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;