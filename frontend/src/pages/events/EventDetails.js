import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
          organizer: {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
          createdAt: '2023-09-01T10:00:00Z',
          updatedAt: '2023-09-15T14:30:00Z',
        };
        
        setEvent(mockEvent);
      } catch (err) {
        setError(err.message || t('errors.unknown'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, t]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setError('');
      
      // In a real application, this would be an API call
      // For now, we'll simulate the deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      handleCloseDeleteDialog();
      navigate('/events', { state: { deleted: true } });
    } catch (err) {
      setError(err.message || t('errors.unknown'));
      handleCloseDeleteDialog();
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const canEditEvent = ['admin', 'product_owner', 'client'].includes(user?.role);
  const canViewParticipants = ['admin', 'product_owner', 'client', 'staff'].includes(user?.role);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          {error || t('events.notFound')}
        </Alert>
        <Button
          component={Link}
          to="/events"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          {t('events.backToList')}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          to="/events"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          {t('events.backToList')}
        </Button>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {event.name}
              </Typography>
              
              <Box>
                <Chip 
                  label={event.status === 'upcoming' ? t('events.statusUpcoming') : t('events.statusCompleted')} 
                  color={event.status === 'upcoming' ? 'primary' : 'default'}
                  sx={{ mr: 1 }}
                />
                
                {canEditEvent && (
                  <Box sx={{ display: 'inline-flex', gap: 1 }}>
                    <Button
                      component={Link}
                      to={`/events/${event.id}/edit`}
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteClick}
                    >
                      {t('common.delete')}
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={t('events.description')} 
                      secondary={event.description} 
                    />
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={t('events.date')} 
                      secondary={formatDate(event.date)} 
                    />
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemIcon>
                      <TimeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={t('events.time')} 
                      secondary={`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`} 
                    />
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={t('events.location')} 
                      secondary={
                        <>
                          <Typography variant="body2">{event.location}</Typography>
                          <Typography variant="body2" color="text.secondary">{event.address}</Typography>
                        </>
                      } 
                    />
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={t('events.capacity')} 
                      secondary={`${event.participants} / ${event.capacity} ${t('events.participants')}`} 
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t('events.organizer')}
                    </Typography>
                    <Typography variant="body1">
                      {event.organizer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {event.organizer.email}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body2" color="text.secondary">
                      {t('events.created')}: {new Date(event.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('events.updated')}: {new Date(event.updatedAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
                
                {canViewParticipants && (
                  <Button
                    component={Link}
                    to={`/events/${event.id}/participants`}
                    variant="contained"
                    fullWidth
                    startIcon={<GroupIcon />}
                    sx={{ mt: 2 }}
                  >
                    {t('events.viewParticipants')}
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>{t('events.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('events.deleteConfirmMessage', { name: event.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails;