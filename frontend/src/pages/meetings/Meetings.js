import React, { useState, useEffect } from 'react';
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
  Avatar,
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
  Tooltip,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Videocam as VideocamIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Link as LinkIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


const Meetings = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [meetingCode, setMeetingCode] = useState('');
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16), // Default to 1 hour from now, format: YYYY-MM-DDThh:mm
    participants: [],
    eventId: null,
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // In a real application, this would be an API call
        // For now, we'll simulate the data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock meetings data
        const mockMeetings = [
          { 
            id: 1, 
            title: 'Project Kickoff Meeting', 
            description: 'Initial discussion about the new project scope and timeline.', 
            date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            status: 'scheduled',
            code: 'MEET-123-456',
            createdBy: { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatarUrl: 'https://mui.com/static/images/avatar/1.jpg' },
            participants: [
              { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatarUrl: 'https://mui.com/static/images/avatar/1.jpg' },
              { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: 'https://mui.com/static/images/avatar/2.jpg' },
              { id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com', avatarUrl: 'https://mui.com/static/images/avatar/3.jpg' },
            ],
            eventId: 1,
            eventName: 'Tech Conference 2023',
          },
          { 
            id: 2, 
            title: 'Weekly Team Sync', 
            description: 'Regular team meeting to discuss progress and blockers.', 
            date: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
            status: 'scheduled',
            code: 'MEET-789-012',
            createdBy: { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatarUrl: 'https://mui.com/static/images/avatar/1.jpg' },
            participants: [
              { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatarUrl: 'https://mui.com/static/images/avatar/1.jpg' },
              { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', avatarUrl: 'https://mui.com/static/images/avatar/4.jpg' },
              { id: 5, name: 'Michael Wilson', email: 'michael.wilson@example.com', avatarUrl: 'https://mui.com/static/images/avatar/5.jpg' },
            ],
            eventId: null,
            eventName: null,
          },
          { 
            id: 3, 
            title: 'Product Demo', 
            description: 'Demonstration of the new features to the client.', 
            date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            status: 'completed',
            code: 'MEET-345-678',
            createdBy: { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatarUrl: 'https://mui.com/static/images/avatar/1.jpg' },
            participants: [
              { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatarUrl: 'https://mui.com/static/images/avatar/1.jpg' },
              { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: 'https://mui.com/static/images/avatar/2.jpg' },
              { id: 6, name: 'Sarah Brown', email: 'sarah.brown@example.com', avatarUrl: 'https://mui.com/static/images/avatar/6.jpg' },
              { id: 7, name: 'David Miller', email: 'david.miller@example.com', avatarUrl: 'https://mui.com/static/images/avatar/7.jpg' },
            ],
            eventId: null,
            eventName: null,
          },
          { 
            id: 4, 
            title: 'Event Planning Committee', 
            description: 'Discussion about the upcoming event logistics and schedule.', 
            date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            status: 'scheduled',
            code: 'MEET-901-234',
            createdBy: { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: 'https://mui.com/static/images/avatar/2.jpg' },
            participants: [
              { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatarUrl: 'https://mui.com/static/images/avatar/1.jpg' },
              { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: 'https://mui.com/static/images/avatar/2.jpg' },
              { id: 8, name: 'Jennifer Taylor', email: 'jennifer.taylor@example.com', avatarUrl: 'https://mui.com/static/images/avatar/8.jpg' },
            ],
            eventId: 2,
            eventName: 'Product Launch',
          },
        ];
        
        setMeetings(mockMeetings);
      } catch (err) {
        setError(err.message || t('errors.unknown'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [t]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setNewMeeting({
      title: '',
      description: '',
      date: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
      participants: [],
      eventId: null,
    });
  };

  const handleCreateMeeting = async () => {
    try {
      setError('');
      
      // Validate form
      if (!newMeeting.title.trim()) {
        setError(t('meetings.titleRequired'));
        return;
      }
      
      // In a real application, this would be an API call
      // For now, we'll simulate creating a meeting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random meeting code
      const meetingCode = `MEET-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}`;
      
      // Create a new meeting object
      const newMeetingObj = {
        id: meetings.length + 1,
        title: newMeeting.title,
        description: newMeeting.description,
        date: newMeeting.date,
        status: 'scheduled',
        code: meetingCode,
        createdBy: { id: user.id, name: 'John Doe', email: user.email, avatarUrl: 'https://mui.com/static/images/avatar/1.jpg' },
        participants: [
          { id: user.id, name: 'John Doe', email: user.email, avatarUrl: 'https://mui.com/static/images/avatar/1.jpg' },
        ],
        eventId: newMeeting.eventId,
        eventName: newMeeting.eventId ? 'Tech Conference 2023' : null, // In a real app, you'd get this from the selected event
      };
      
      // Update the local state
      setMeetings([newMeetingObj, ...meetings]);
      
      // Show success message
      setSuccessMessage(t('meetings.createSuccess'));
      setTimeout(() => setSuccessMessage(''), 5000);
      
      handleCloseCreateDialog();
    } catch (err) {
      setError(err.message || t('errors.unknown'));
    }
  };

  const handleOpenDeleteDialog = (meeting) => {
    setSelectedMeeting(meeting);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedMeeting(null);
  };

  const handleDeleteMeeting = async () => {
    try {
      setError('');
      
      // In a real application, this would be an API call
      // For now, we'll simulate deleting a meeting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the local state
      setMeetings(meetings.filter(m => m.id !== selectedMeeting.id));
      
      // Show success message
      setSuccessMessage(t('meetings.deleteSuccess'));
      setTimeout(() => setSuccessMessage(''), 5000);
      
      handleCloseDeleteDialog();
    } catch (err) {
      setError(err.message || t('errors.unknown'));
      handleCloseDeleteDialog();
    }
  };

  const handleOpenJoinDialog = () => {
    setOpenJoinDialog(true);
  };

  const handleCloseJoinDialog = () => {
    setOpenJoinDialog(false);
    setMeetingCode('');
  };

  const handleJoinMeeting = () => {
    // In a real application, this would navigate to the meeting room
    // For now, we'll just close the dialog and show a success message
    setSuccessMessage(t('meetings.joinSuccess'));
    setTimeout(() => setSuccessMessage(''), 5000);
    handleCloseJoinDialog();
  };

  const handleCopyMeetingCode = (code) => {
    navigator.clipboard.writeText(code);
    setSuccessMessage(t('meetings.codeCopied'));
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tabValue === 0) { // All meetings
      return matchesSearch;
    } else if (tabValue === 1) { // Upcoming meetings
      return matchesSearch && meeting.status === 'scheduled' && new Date(meeting.date) > new Date();
    } else if (tabValue === 2) { // Past meetings
      return matchesSearch && (meeting.status === 'completed' || new Date(meeting.date) < new Date());
    }
    return false;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const isUpcoming = (date) => {
    return new Date(date) > new Date();
  };

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
        <Typography variant="h4" component="h1" gutterBottom>
          {t('meetings.title')}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}
        
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label={t('meetings.allMeetings')} icon={<VideocamIcon />} />
              <Tab label={t('meetings.upcomingMeetings')} icon={<ScheduleIcon />} />
              <Tab label={t('meetings.pastMeetings')} icon={<EventIcon />} />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <TextField
                placeholder={t('meetings.search')}
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<LinkIcon />}
                  onClick={handleOpenJoinDialog}
                  sx={{ mr: 2 }}
                >
                  {t('meetings.joinMeeting')}
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenCreateDialog}
                >
                  {t('meetings.createMeeting')}
                </Button>
              </Box>
            </Box>
            
            {filteredMeetings.length > 0 ? (
              <Grid container spacing={3}>
                {filteredMeetings.map((meeting) => (
                  <Grid item xs={12} md={6} key={meeting.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" component="div">
                            {meeting.title}
                          </Typography>
                          <Chip 
                            label={isUpcoming(meeting.date) ? t('meetings.upcoming') : t('meetings.past')} 
                            color={isUpcoming(meeting.date) ? 'primary' : 'default'}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {meeting.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(meeting.date)}
                          </Typography>
                        </Box>
                        
                        {meeting.eventName && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {t('meetings.associatedEvent')}: 
                              <Link to={`/events/${meeting.eventId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography component="span" color="primary" sx={{ ml: 0.5 }}>
                                  {meeting.eventName}
                                </Typography>
                              </Link>
                            </Typography>
                          </Box>
                        )}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LinkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {meeting.code}
                          </Typography>
                          <IconButton size="small" onClick={() => handleCopyMeetingCode(meeting.code)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {t('meetings.participants')} ({meeting.participants.length}):
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {meeting.participants.map((participant) => (
                              <Chip
                                key={participant.id}
                                avatar={<Avatar alt={participant.name} src={participant.avatarUrl} />}
                                label={participant.name}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions>
                        {isUpcoming(meeting.date) && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<VideocamIcon />}
                            fullWidth
                          >
                            {t('meetings.join')}
                          </Button>
                        )}
                        
                        {meeting.createdBy.id === user.id && (
                          <>
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                            >
                              {t('common.edit')}
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleOpenDeleteDialog(meeting)}
                            >
                              {t('common.delete')}
                            </Button>
                          </>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                {searchTerm ? t('meetings.noMeetingsFound') : t('meetings.noMeetings')}
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
      
      {/* Create Meeting Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('meetings.createMeeting')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('meetings.createMeetingDescription')}
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label={t('meetings.meetingTitle')}
            type="text"
            fullWidth
            value={newMeeting.title}
            onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            id="description"
            label={t('meetings.meetingDescription')}
            type="text"
            fullWidth
            multiline
            rows={3}
            value={newMeeting.description}
            onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            id="date"
            label={t('meetings.meetingDate')}
            type="datetime-local"
            fullWidth
            value={newMeeting.date}
            onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          {/* In a real application, you would have a dropdown to select an event */}
          <TextField
            select
            margin="dense"
            id="eventId"
            label={t('meetings.associatedEvent')}
            fullWidth
            value={newMeeting.eventId || ''}
            onChange={(e) => setNewMeeting({ ...newMeeting, eventId: e.target.value ? Number(e.target.value) : null })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">{t('meetings.noEvent')}</MenuItem>
            <MenuItem value="1">Tech Conference 2023</MenuItem>
            <MenuItem value="2">Product Launch</MenuItem>
          </TextField>
          
          {/* In a real application, you would have a component to add participants */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {t('meetings.participantsNote')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleCreateMeeting} variant="contained">
            {t('meetings.create')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Meeting Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>{t('meetings.deleteMeeting')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedMeeting && t('meetings.deleteMeetingConfirmation', { title: selectedMeeting.title })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDeleteMeeting} color="error">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Join Meeting Dialog */}
      <Dialog
        open={openJoinDialog}
        onClose={handleCloseJoinDialog}
      >
        <DialogTitle>{t('meetings.joinMeeting')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('meetings.enterMeetingCode')}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="meetingCode"
            label={t('meetings.meetingCode')}
            type="text"
            fullWidth
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJoinDialog}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleJoinMeeting} 
            variant="contained"
            disabled={!meetingCode.trim()}
          >
            {t('meetings.join')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Meetings;