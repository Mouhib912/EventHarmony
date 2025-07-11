import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Videocam as VideocamIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const OnlineMeetings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    meetingLink: '',
    participants: [],
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [participatingRes, organizedRes] = await Promise.all([
        axios.get('/api/online-meetings/participating'),
        axios.get('/api/online-meetings/organized'),
      ]);

      const allMeetings = [
        ...participatingRes.data.meetings,
        ...organizedRes.data.meetings,
      ];

      setMeetings(allMeetings);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError(t('errors.fetchFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    try {
      setError('');
      await axios.post('/api/online-meetings', formData);
      setOpenDialog(false);
      fetchMeetings();
    } catch (err) {
      console.error('Error creating meeting:', err);
      setError(t('errors.createFailed'));
    }
  };

  const handleUpdateStatus = async (meetingId, status) => {
    try {
      setError('');
      await axios.patch(`/api/online-meetings/${meetingId}/status`, { status });
      fetchMeetings();
    } catch (err) {
      console.error('Error updating meeting status:', err);
      setError(t('errors.updateFailed'));
    }
  };

  const handleJoinMeeting = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'warning';
      case 'in-progress': return 'success';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          {t('common.pleaseLogin')}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('meetings.onlineMeetings')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          {t('meetings.createNew')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {meetings.map((meeting) => (
            <Grid item xs={12} md={6} key={meeting._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VideocamIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      {meeting.title}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {meeting.description}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={t(`meetings.status.${meeting.status}`)}
                      color={getStatusColor(meeting.status)}
                      size="small"
                    />
                    <Chip
                      label={`${meeting.participants.length} ${t('meetings.participants')}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('meetings.startTime')}: {new Date(meeting.startTime).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {t('meetings.endTime')}: {new Date(meeting.endTime).toLocaleString()}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleJoinMeeting(meeting.meetingLink)}
                      disabled={meeting.status !== 'scheduled' && meeting.status !== 'in-progress'}
                    >
                      {t('meetings.join')}
                    </Button>
                    {meeting.organizer === user.id && (
                      <Button
                        variant="outlined"
                        color={meeting.status === 'scheduled' ? 'success' : 'error'}
                        onClick={() => handleUpdateStatus(
                          meeting._id,
                          meeting.status === 'scheduled' ? 'in-progress' : 'completed'
                        )}
                      >
                        {meeting.status === 'scheduled'
                          ? t('meetings.start')
                          : t('meetings.end')}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Meeting Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('meetings.createOnlineMeeting')}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label={t('meetings.title')}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('meetings.description')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label={t('meetings.startTime')}
                  value={formData.startTime}
                  onChange={(newValue) => setFormData({ ...formData, startTime: newValue })}
                />
                <DateTimePicker
                  label={t('meetings.endTime')}
                  value={formData.endTime}
                  onChange={(newValue) => setFormData({ ...formData, endTime: newValue })}
                />
              </LocalizationProvider>
              <TextField
                fullWidth
                label={t('meetings.meetingLink')}
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleCreateMeeting} variant="contained">
            {t('meetings.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnlineMeetings;
