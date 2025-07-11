import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Event as EventIcon,
  People as PeopleIcon,  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

const Meets = () => {
  const { t } = useTranslation();
  const { user } = useAuth(); // Using user from auth context
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [meets, setMeets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openMeetDialog, setOpenMeetDialog] = useState(false);

  useEffect(() => {
    const fetchMeets = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await axios.get(`/api/b2b-meetings/user/${user.id}`);
        setMeets(response.data);
      } catch (err) {
        console.error('Error fetching meets:', err);
        setError(t('errors.unknown'));
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMeets();
    }
  }, [t, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseMeetDialog = () => {
    setOpenMeetDialog(false);
  };

  const handleRequestMeet = async () => {
    try {
      setError('');
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleCloseMeetDialog();
    } catch (err) {
      setError(err.message || t('errors.unknown'));
    }
  };

  const handleAcceptMeet = async (meetId) => {
    try {
      setError('');      await axios.patch(`/api/b2b-meetings/${meetId}/status`, {
        status: 'accepted',
      });
      // Refresh the meets list
      const response = await axios.get(`/api/b2b-meetings/user/${user.id}`);
      setMeets(response.data);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.unknown'));
    }
  };

  const handleDeclineMeet = async (meetId) => {
    try {
      setError('');      await axios.patch(`/api/b2b-meetings/${meetId}/status`, {
        status: 'declined',
      });
      // Refresh the meets list
      const response = await axios.get(`/api/b2b-meetings/user/${user.id}`);
      setMeets(response.data);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.unknown'));
    }
  };

  const handleDeleteMeet = async (meetId) => {
    try {
      setError('');
      await axios.delete(`/api/b2b-meetings/${meetId}`);
      // Remove the meet from state
      setMeets(meets.filter(meet => meet._id !== meetId));
    } catch (err) {
      setError(err.response?.data?.message || t('errors.unknown'));
    }
  };

  const filteredMeets = meets.filter(meet => 
    meet.event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meet.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meet.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'declined':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  // If no user is authenticated, show login prompt
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">
          {t('common.pleaseLogin')}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('meets.title')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/events"
        >
          {t('meets.findEvents')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={t('meets.tabs.upcoming')} />
            <Tab label={t('meets.tabs.past')} />
            <Tab label={t('meets.tabs.requested')} />
          </Tabs>
        </Box>
      </Paper>

      <TextField
        fullWidth
        variant="outlined"
        placeholder={t('meets.searchPlaceholder')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMeets.map((meet) => (
            <Grid item xs={12} md={6} key={meet._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      {meet.event.name}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PeopleIcon sx={{ mr: 1, fontSize: 'small' }} />
                        <Typography variant="body2">
                          {`${meet.recipient.name} (${meet.recipient.company || 'N/A'})`}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon sx={{ mr: 1, fontSize: 'small' }} />
                        <Typography variant="body2">
                          {new Date(meet.meetingTime).toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={t(`meets.status.${meet.status}`)}
                      color={getStatusColor(meet.status)}
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  {meet.status === 'pending' && meet.recipient._id === user.id && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleAcceptMeet(meet._id)}
                      >
                        {t('meets.accept')}
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeclineMeet(meet._id)}
                      >
                        {t('meets.decline')}
                      </Button>
                    </>
                  )}
                  {(meet.requester._id === user.id || meet.recipient._id === user.id) && (
                    <>
                      <IconButton size="small" color="error" sx={{ ml: 'auto' }}
                        onClick={() => handleDeleteMeet(meet._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openMeetDialog} onClose={handleCloseMeetDialog}>
        <DialogTitle>{t('meets.requestMeet')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('meets.requestDescription')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMeetDialog} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleRequestMeet} variant="contained" color="primary">
            {t('meets.request')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Meets;
