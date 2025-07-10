import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const EventParticipants = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newParticipantEmail, setNewParticipantEmail] = useState('');

  useEffect(() => {
    const fetchEventAndParticipants = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // In a real application, these would be actual API calls
        // For now, we'll simulate the data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock event data
        const mockEvent = {
          id: parseInt(id),
          name: 'Tech Conference 2023',
          date: '2023-12-15',
          location: 'New York Convention Center',
          capacity: 200,
        };
        
        // Mock participants data
        const mockParticipants = [
          { id: 1, name: 'John Doe', email: 'john.doe@example.com', status: 'confirmed', registeredAt: '2023-09-10T14:30:00Z' },
          { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', status: 'confirmed', registeredAt: '2023-09-11T09:15:00Z' },
          { id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com', status: 'pending', registeredAt: '2023-09-12T16:45:00Z' },
          { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', status: 'confirmed', registeredAt: '2023-09-13T11:20:00Z' },
          { id: 5, name: 'Michael Wilson', email: 'michael.wilson@example.com', status: 'cancelled', registeredAt: '2023-09-14T08:10:00Z' },
          { id: 6, name: 'Sarah Brown', email: 'sarah.brown@example.com', status: 'confirmed', registeredAt: '2023-09-15T13:40:00Z' },
          { id: 7, name: 'David Miller', email: 'david.miller@example.com', status: 'pending', registeredAt: '2023-09-16T15:55:00Z' },
          { id: 8, name: 'Jennifer Taylor', email: 'jennifer.taylor@example.com', status: 'confirmed', registeredAt: '2023-09-17T10:25:00Z' },
          { id: 9, name: 'James Anderson', email: 'james.anderson@example.com', status: 'confirmed', registeredAt: '2023-09-18T12:30:00Z' },
          { id: 10, name: 'Lisa Thomas', email: 'lisa.thomas@example.com', status: 'pending', registeredAt: '2023-09-19T14:15:00Z' },
          { id: 11, name: 'Daniel Jackson', email: 'daniel.jackson@example.com', status: 'confirmed', registeredAt: '2023-09-20T09:45:00Z' },
          { id: 12, name: 'Patricia White', email: 'patricia.white@example.com', status: 'cancelled', registeredAt: '2023-09-21T16:20:00Z' },
        ];
        
        setEvent(mockEvent);
        setParticipants(mockParticipants);
      } catch (err) {
        setError(err.message || t('errors.unknown'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventAndParticipants();
  }, [id, t]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRemoveClick = (participant) => {
    setSelectedParticipant(participant);
    setOpenRemoveDialog(true);
  };

  const handleCloseRemoveDialog = () => {
    setOpenRemoveDialog(false);
    setSelectedParticipant(null);
  };

  const handleConfirmRemove = async () => {
    try {
      setError('');
      
      // In a real application, this would be an API call
      // For now, we'll simulate the removal
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the local state
      setParticipants(participants.filter(p => p.id !== selectedParticipant.id));
      
      handleCloseRemoveDialog();
    } catch (err) {
      setError(err.message || t('errors.unknown'));
      handleCloseRemoveDialog();
    }
  };

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewParticipantEmail('');
  };

  const handleConfirmAdd = async () => {
    try {
      setError('');
      
      // In a real application, this would be an API call
      // For now, we'll simulate adding a participant
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the local state with a new mock participant
      const newParticipant = {
        id: participants.length + 1,
        name: newParticipantEmail.split('@')[0].replace('.', ' '),
        email: newParticipantEmail,
        status: 'pending',
        registeredAt: new Date().toISOString(),
      };
      
      setParticipants([...participants, newParticipant]);
      
      handleCloseAddDialog();
    } catch (err) {
      setError(err.message || t('errors.unknown'));
      handleCloseAddDialog();
    }
  };

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedParticipants = filteredParticipants.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getStatusChip = (status) => {
    switch (status) {
      case 'confirmed':
        return <Chip label={t('events.statusConfirmed')} color="success" size="small" icon={<CheckCircleIcon />} />;
      case 'pending':
        return <Chip label={t('events.statusPending')} color="warning" size="small" />;
      case 'cancelled':
        return <Chip label={t('events.statusCancelled')} color="error" size="small" icon={<CancelIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

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
          to={`/events/${id}`}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          {t('events.backToDetails')}
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          {t('events.participants')}: {event.name}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder={t('events.searchParticipants')}
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
            
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddClick}
            >
              {t('events.addParticipant')}
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('events.participantName')}</TableCell>
                  <TableCell>{t('events.participantEmail')}</TableCell>
                  <TableCell>{t('events.participantStatus')}</TableCell>
                  <TableCell>{t('events.participantRegistered')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedParticipants.length > 0 ? (
                  paginatedParticipants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>{getStatusChip(participant.status)}</TableCell>
                      <TableCell>{formatDate(participant.registeredAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          aria-label="email participant"
                          component="a"
                          href={`mailto:${participant.email}`}
                        >
                          <EmailIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="remove participant"
                          onClick={() => handleRemoveClick(participant)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {searchTerm ? t('events.noParticipantsFound') : t('events.noParticipants')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={filteredParticipants.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </Paper>
        
        <Typography variant="body2" color="text.secondary">
          {t('events.participantsCount', { count: participants.length, capacity: event.capacity })}
        </Typography>
      </Box>
      
      {/* Remove Participant Dialog */}
      <Dialog
        open={openRemoveDialog}
        onClose={handleCloseRemoveDialog}
      >
        <DialogTitle>{t('events.removeParticipantTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedParticipant && t('events.removeParticipantMessage', { name: selectedParticipant.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveDialog}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleConfirmRemove} color="error" autoFocus>
            {t('common.remove')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Participant Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
      >
        <DialogTitle>{t('events.addParticipantTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('events.addParticipantMessage')}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label={t('events.participantEmail')}
            type="email"
            fullWidth
            value={newParticipantEmail}
            onChange={(e) => setNewParticipantEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleConfirmAdd} 
            color="primary" 
            disabled={!newParticipantEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newParticipantEmail)}
          >
            {t('common.add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventParticipants;