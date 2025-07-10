import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
// Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const Dashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalParticipants: 0,
    pendingTasks: 0,
  });
  
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real application, these would be actual API calls
        // For now, we'll simulate the data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStats({
          totalEvents: 12,
          activeEvents: 5,
          totalParticipants: 450,
          pendingTasks: 8,
        });
        
        setUpcomingEvents([
          { id: 1, name: 'Tech Conference 2023', date: '2023-12-15', location: 'New York', participants: 120 },
          { id: 2, name: 'Product Launch', date: '2023-11-30', location: 'San Francisco', participants: 85 },
          { id: 3, name: 'Annual Meeting', date: '2023-12-05', location: 'Chicago', participants: 50 },
        ]);
        
        setRecentActivity([
          { id: 1, type: 'registration', event: 'Tech Conference 2023', user: 'John Doe', time: '2 hours ago' },
          { id: 2, type: 'meeting_request', event: 'Product Launch', user: 'Jane Smith', time: '5 hours ago' },
          { id: 3, type: 'event_created', event: 'Annual Meeting', user: 'Admin', time: '1 day ago' },
          { id: 4, type: 'check_in', event: 'Tech Conference 2023', user: 'Mike Johnson', time: '1 day ago' },
        ]);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(t('errors.unknown'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [t]);

  // Registration timeline chart data
  const registrationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: t('events.statistics.registrations'),
        data: [30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        tension: 0.4,
      },
    ],
  };

  // Participant status chart data
  const participantStatusData = {
    labels: [
      t('events.participants.status.registered'),
      t('events.participants.status.confirmed'),
      t('events.participants.status.checkedIn'),
      t('events.participants.status.cancelled'),
    ],
    datasets: [
      {
        data: [250, 100, 80, 20],
        backgroundColor: [
          theme.palette.info.main,
          theme.palette.success.main,
          theme.palette.primary.main,
          theme.palette.error.main,
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('dashboard.title')}
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            {t('dashboard.welcome', { name: user?.firstName || '' })}
          </Typography>
          
          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 120,
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {t('dashboard.totalEvents')}
                </Typography>
                <Typography variant="h3">{stats.totalEvents}</Typography>
                <EventIcon sx={{ position: 'absolute', right: 16, top: 16, opacity: 0.3, fontSize: 40 }} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 120,
                  backgroundColor: theme.palette.secondary.light,
                  color: theme.palette.secondary.contrastText,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {t('dashboard.activeEvents')}
                </Typography>
                <Typography variant="h3">{stats.activeEvents}</Typography>
                <EventIcon sx={{ position: 'absolute', right: 16, top: 16, opacity: 0.3, fontSize: 40 }} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 120,
                  backgroundColor: theme.palette.success.light,
                  color: theme.palette.success.contrastText,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {t('dashboard.totalParticipants')}
                </Typography>
                <Typography variant="h3">{stats.totalParticipants}</Typography>
                <PeopleIcon sx={{ position: 'absolute', right: 16, top: 16, opacity: 0.3, fontSize: 40 }} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 120,
                  backgroundColor: theme.palette.warning.light,
                  color: theme.palette.warning.contrastText,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {t('dashboard.pendingTasks')}
                </Typography>
                <Typography variant="h3">{stats.pendingTasks}</Typography>
                <CheckCircleIcon sx={{ position: 'absolute', right: 16, top: 16, opacity: 0.3, fontSize: 40 }} />
              </Paper>
            </Grid>
          </Grid>
          
          {/* Main Dashboard Content */}
          <Grid container spacing={3}>
            {/* Upcoming Events */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title={t('dashboard.upcomingEvents')}
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent>
                  {upcomingEvents.length > 0 ? (
                    <List>
                      {upcomingEvents.map((event) => (
                        <React.Fragment key={event.id}>
                          <ListItem
                            secondaryAction={
                              <IconButton edge="end" component={Link} to={`/events/${event.id}`}>
                                <ArrowForwardIcon />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              primary={event.name}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2" color="text.primary">
                                    {new Date(event.date).toLocaleDateString()}
                                  </Typography>
                                  {` — ${event.location} (${event.participants} ${t('events.participants.title').toLowerCase()})`}
                                </>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" align="center" sx={{ py: 2 }}>
                      {t('events.noEvents')}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      component={Link}
                      to="/events"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                    >
                      {t('dashboard.viewAll')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Recent Activity */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title={t('dashboard.recentActivity')}
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <List>
                      {recentActivity.map((activity) => (
                        <React.Fragment key={activity.id}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography variant="body1">
                                  {activity.user}{' '}
                                  {activity.type === 'registration' && 'registered for'}{' '}
                                  {activity.type === 'meeting_request' && 'requested a meeting at'}{' '}
                                  {activity.type === 'event_created' && 'created'}{' '}
                                  {activity.type === 'check_in' && 'checked in at'}{' '}
                                  <Typography component="span" color="primary.main">
                                    {activity.event}
                                  </Typography>
                                </Typography>
                              }
                              secondary={activity.time}
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" align="center" sx={{ py: 2 }}>
                      No recent activity
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Charts */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title={t('events.statistics.registrationTimeline')} />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 300 }}>
                    <Line
                      data={registrationData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title={t('events.participants.title')} />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    <Doughnut
                      data={participantStatusData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;