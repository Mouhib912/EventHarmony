import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const EventsList = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // In a real application, this would be an API call
        // For now, we'll simulate the data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockEvents = [
          { id: 1, name: 'Tech Conference 2023', date: '2023-12-15', location: 'New York', participants: 120, status: 'upcoming' },
          { id: 2, name: 'Product Launch', date: '2023-11-30', location: 'San Francisco', participants: 85, status: 'upcoming' },
          { id: 3, name: 'Annual Meeting', date: '2023-12-05', location: 'Chicago', participants: 50, status: 'upcoming' },
          { id: 4, name: 'Team Building Workshop', date: '2023-10-20', location: 'Boston', participants: 30, status: 'completed' },
          { id: 5, name: 'Industry Summit', date: '2023-11-15', location: 'Seattle', participants: 200, status: 'upcoming' },
          { id: 6, name: 'Networking Event', date: '2023-09-10', location: 'Austin', participants: 75, status: 'completed' },
        ];
        
        setEvents(mockEvents);
        setTotalPages(Math.ceil(mockEvents.length / 6));
      } catch (err) {
        setError(err.message || t('errors.unknown'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [t]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredEvents = events
    .filter(event => event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.location.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(event => statusFilter === 'all' || event.status === statusFilter);

  const paginatedEvents = filteredEvents.slice((page - 1) * 6, page * 6);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const canCreateEvent = ['admin', 'product_owner', 'client'].includes(user?.role);

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
          {t('events.title')}
        </Typography>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder={t('events.search')}
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">{t('events.status')}</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label={t('events.status')}
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">{t('events.statusAll')}</MenuItem>
                <MenuItem value="upcoming">{t('events.statusUpcoming')}</MenuItem>
                <MenuItem value="completed">{t('events.statusCompleted')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            {canCreateEvent && (
              <Button
                component={Link}
                to="/events/create"
                variant="contained"
                startIcon={<AddIcon />}
              >
                {t('events.createEvent')}
              </Button>
            )}
          </Grid>
        </Grid>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {filteredEvents.length === 0 ? (
          <Alert severity="info">
            {t('events.noEventsFound')}
          </Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom noWrap>
                        {event.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(event.date)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {event.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.participants} {t('events.participants')}
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        to={`/events/${event.id}`}
                        variant="outlined"
                        fullWidth
                        startIcon={<EventIcon />}
                      >
                        {t('events.viewDetails')}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default EventsList;