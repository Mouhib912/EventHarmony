import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon,
  Videocam as VideocamIcon,
  Event as EventIcon,

} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
);

const Dashboard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [b2bMeetings, setB2bMeetings] = useState([]);
  const [onlineMeetings, setOnlineMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch events
        const eventsResponse = await axios.get('/api/events');
        setEvents(eventsResponse.data.events);

        // Fetch B2B meetings
        const b2bResponse = await axios.get('/api/b2b-meetings/user');
        setB2bMeetings(b2bResponse.data.meetings);

        // Fetch online meetings
        const onlineResponse = await axios.get('/api/online-meetings/participating');
        const organizedResponse = await axios.get('/api/online-meetings/organized');
        setOnlineMeetings([
          ...onlineResponse.data.meetings,
          ...organizedResponse.data.meetings,
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(t('errors.fetchFailed'));
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [t, user]);

  // Calculate statistics
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.startDate) > new Date()).length,
    totalB2BMeetings: b2bMeetings.length,
    totalOnlineMeetings: onlineMeetings.length,
    pendingB2B: b2bMeetings.filter(m => m.status === 'pending').length,
    pendingOnline: onlineMeetings.filter(m => m.status === 'scheduled').length,
    completedB2B: b2bMeetings.filter(m => m.status === 'completed').length,
    completedOnline: onlineMeetings.filter(m => m.status === 'completed').length,
  };

  // Meeting status colors
  const getStatusColor = (status, type) => {
    if (type === 'b2b') {
      switch (status) {
        case 'accepted': return theme.palette.success.main;
        case 'pending': return theme.palette.warning.main;
        case 'declined': return theme.palette.error.main;
        case 'completed': return theme.palette.info.main;
        default: return theme.palette.grey[500];
      }
    } else {
      switch (status) {
        case 'scheduled': return theme.palette.warning.main;
        case 'in-progress': return theme.palette.success.main;
        case 'completed': return theme.palette.info.main;
        case 'cancelled': return theme.palette.error.main;
        default: return theme.palette.grey[500];
      }
    }
  };

  // Chart data for meetings statistics
  const meetingsChartData = {
    labels: [t('dashboard.b2bMeetings'), t('dashboard.onlineMeetings')],
    datasets: [
      {
        data: [stats.totalB2BMeetings, stats.totalOnlineMeetings],
        backgroundColor: [theme.palette.primary.main, theme.palette.secondary.main],
        borderColor: [theme.palette.primary.dark, theme.palette.secondary.dark],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Event list component
  const EventsList = ({ events }) => (
    <List>
      {events.slice(0, 5).map((event) => (
        <ListItem
          key={event._id}
          secondaryAction={
            <Button
              component={Link}
              to={`/events/${event._id}`}
              size="small"
              variant="outlined"
            >
              {t('dashboard.viewDetails')}
            </Button>
          }
        >
          <ListItemText
            primary={event.name}
            secondary={new Date(event.startDate).toLocaleDateString()}
          />
        </ListItem>
      ))}
      <ListItem>
        <Button
          component={Link}
          to="/events"
          endIcon={<ArrowForwardIcon />}
          sx={{ ml: 'auto' }}
        >
          {t('dashboard.viewAllEvents')}
        </Button>
      </ListItem>
    </List>
  );

  // Meeting list component
  const MeetingsList = ({ meetings, type }) => (
    <List>
      {meetings.slice(0, 5).map((meeting) => (
        <ListItem
          key={meeting._id}
          secondaryAction={
            <Chip
              size="small"
              label={t(`meetings.status.${meeting.status}`)}
              sx={{ backgroundColor: getStatusColor(meeting.status, type) }}
            />
          }
        >
          <ListItemText
            primary={type === 'b2b' ? meeting.event.name : meeting.title}
            secondary={
              type === 'b2b'
                ? `${t('meetings.with')} ${meeting.recipient.firstName} ${meeting.recipient.lastName}`
                : `${t('meetings.participants')}: ${meeting.participants.length}`
            }
          />
        </ListItem>
      ))}
      <ListItem>
        <Button
          component={Link}
          to={type === 'b2b' ? '/meets' : '/online-meetings'}
          endIcon={<ArrowForwardIcon />}
          sx={{ ml: 'auto' }}
        >
          {t('dashboard.viewAll')}
        </Button>
      </ListItem>
    </List>
  );

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
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ mr: 2 }} />
                <Typography variant="h6">
                  {t('dashboard.events')}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
                {stats.totalEvents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.upcomingEvents} {t('dashboard.upcoming')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 2 }} />
                <Typography variant="h6">
                  {t('dashboard.b2bMeetings')}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
                {stats.totalB2BMeetings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.pendingB2B} {t('dashboard.pending')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VideocamIcon sx={{ mr: 2 }} />
                <Typography variant="h6">
                  {t('dashboard.onlineMeetings')}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
                {stats.totalOnlineMeetings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.pendingOnline} {t('dashboard.scheduled')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon sx={{ mr: 2 }} />
                <Typography variant="h6">
                  {t('dashboard.completed')}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
                {stats.completedB2B + stats.completedOnline}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('dashboard.totalCompleted')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title={t('dashboard.upcomingEvents')} />
            <Divider />
            <CardContent>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <EventsList events={events.filter(e => new Date(e.startDate) > new Date())} />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Meetings Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title={t('dashboard.meetingsDistribution')} />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center' }}>
                <Doughnut data={meetingsChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Meetings Overview */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title={t('dashboard.meetingsOverview')}
              action={
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                >
                  <Tab label={t('dashboard.b2bMeetings')} />
                  <Tab label={t('dashboard.onlineMeetings')} />
                </Tabs>
              }
            />
            <Divider />
            <CardContent>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                activeTab === 0 ? (
                  <MeetingsList meetings={b2bMeetings} type="b2b" />
                ) : (
                  <MeetingsList meetings={onlineMeetings} type="online" />
                )
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;