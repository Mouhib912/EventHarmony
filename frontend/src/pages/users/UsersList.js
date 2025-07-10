import React, { useState, useEffect } from 'react';
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
  Avatar,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const UsersList = () => {
  useAuth(); // We'll use this later when implementing role-based access
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // In a real application, this would be an API call
        // For now, we'll simulate the data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock users data
        const mockUsers = [
          { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'admin', status: 'active', lastLogin: '2023-09-20T08:45:00Z', createdAt: '2023-01-15T10:30:00Z', avatarUrl: 'https://mui.com/static/images/avatar/1.jpg' },
          { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', role: 'user', status: 'active', lastLogin: '2023-09-19T14:20:00Z', createdAt: '2023-02-10T09:15:00Z', avatarUrl: 'https://mui.com/static/images/avatar/2.jpg' },
          { id: 3, firstName: 'Robert', lastName: 'Johnson', email: 'robert.johnson@example.com', role: 'user', status: 'inactive', lastLogin: '2023-08-05T11:30:00Z', createdAt: '2023-03-05T16:45:00Z', avatarUrl: 'https://mui.com/static/images/avatar/3.jpg' },
          { id: 4, firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@example.com', role: 'moderator', status: 'active', lastLogin: '2023-09-18T10:10:00Z', createdAt: '2023-03-20T13:20:00Z', avatarUrl: 'https://mui.com/static/images/avatar/4.jpg' },
          { id: 5, firstName: 'Michael', lastName: 'Wilson', email: 'michael.wilson@example.com', role: 'user', status: 'active', lastLogin: '2023-09-15T09:05:00Z', createdAt: '2023-04-12T08:30:00Z', avatarUrl: 'https://mui.com/static/images/avatar/5.jpg' },
          { id: 6, firstName: 'Sarah', lastName: 'Brown', email: 'sarah.brown@example.com', role: 'user', status: 'pending', lastLogin: null, createdAt: '2023-09-10T15:40:00Z', avatarUrl: 'https://mui.com/static/images/avatar/6.jpg' },
          { id: 7, firstName: 'David', lastName: 'Miller', email: 'david.miller@example.com', role: 'user', status: 'active', lastLogin: '2023-09-17T16:25:00Z', createdAt: '2023-05-08T11:15:00Z', avatarUrl: 'https://mui.com/static/images/avatar/7.jpg' },
          { id: 8, firstName: 'Jennifer', lastName: 'Taylor', email: 'jennifer.taylor@example.com', role: 'moderator', status: 'active', lastLogin: '2023-09-16T13:50:00Z', createdAt: '2023-06-15T10:20:00Z', avatarUrl: 'https://mui.com/static/images/avatar/8.jpg' },
          { id: 9, firstName: 'James', lastName: 'Anderson', email: 'james.anderson@example.com', role: 'user', status: 'blocked', lastLogin: '2023-07-20T09:30:00Z', createdAt: '2023-07-01T14:10:00Z', avatarUrl: 'https://mui.com/static/images/avatar/9.jpg' },
          { id: 10, firstName: 'Lisa', lastName: 'Thomas', email: 'lisa.thomas@example.com', role: 'user', status: 'active', lastLogin: '2023-09-14T11:45:00Z', createdAt: '2023-07-25T08:55:00Z', avatarUrl: 'https://mui.com/static/images/avatar/10.jpg' },
          { id: 11, firstName: 'Daniel', lastName: 'Jackson', email: 'daniel.jackson@example.com', role: 'user', status: 'active', lastLogin: '2023-09-13T15:15:00Z', createdAt: '2023-08-10T13:40:00Z', avatarUrl: 'https://mui.com/static/images/avatar/1.jpg' },
          { id: 12, firstName: 'Patricia', lastName: 'White', email: 'patricia.white@example.com', role: 'user', status: 'active', lastLogin: '2023-09-12T10:05:00Z', createdAt: '2023-08-22T09:25:00Z', avatarUrl: 'https://mui.com/static/images/avatar/2.jpg' },
        ];
        
        setUsers(mockUsers);
      } catch (err) {
        setError(err.message || t('errors.unknown'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

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

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setError('');
      
      // In a real application, this would be an API call
      // For now, we'll simulate the deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the local state
      setUsers(users.filter(u => u.id !== selectedUser.id));
      
      handleCloseDeleteDialog();
    } catch (err) {
      setError(err.message || t('errors.unknown'));
      handleCloseDeleteDialog();
    }
  };

  const handleRoleClick = () => {
    setOpenRoleDialog(true);
    handleMenuClose();
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
  };

  const handleConfirmRoleChange = async (newRole) => {
    try {
      setError('');
      
      // In a real application, this would be an API call
      // For now, we'll simulate the role change
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the local state
      setUsers(users.map(u => {
        if (u.id === selectedUser.id) {
          return { ...u, role: newRole };
        }
        return u;
      }));
      
      handleCloseRoleDialog();
    } catch (err) {
      setError(err.message || t('errors.unknown'));
      handleCloseRoleDialog();
    }
  };

  const handleStatusClick = () => {
    setOpenStatusDialog(true);
    handleMenuClose();
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
  };

  const handleConfirmStatusChange = async (newStatus) => {
    try {
      setError('');
      
      // In a real application, this would be an API call
      // For now, we'll simulate the status change
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the local state
      setUsers(users.map(u => {
        if (u.id === selectedUser.id) {
          return { ...u, status: newStatus };
        }
        return u;
      }));
      
      handleCloseStatusDialog();
    } catch (err) {
      setError(err.message || t('errors.unknown'));
      handleCloseStatusDialog();
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getRoleChip = (role) => {
    switch (role) {
      case 'admin':
        return <Chip label={t('users.roleAdmin')} color="error" size="small" icon={<AdminIcon />} />;
      case 'moderator':
        return <Chip label={t('users.roleModerator')} color="warning" size="small" />;
      case 'user':
        return <Chip label={t('users.roleUser')} color="primary" size="small" icon={<PersonIcon />} />;
      default:
        return <Chip label={role} size="small" />;
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip label={t('users.statusActive')} color="success" size="small" icon={<CheckCircleIcon />} />;
      case 'inactive':
        return <Chip label={t('users.statusInactive')} color="default" size="small" />;
      case 'pending':
        return <Chip label={t('users.statusPending')} color="info" size="small" />;
      case 'blocked':
        return <Chip label={t('users.statusBlocked')} color="error" size="small" icon={<BlockIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : t('users.never');
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
          {t('users.title')}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder={t('users.search')}
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
              startIcon={<AddIcon />}
              component={Link}
              to="/register"
            >
              {t('users.addUser')}
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('users.user')}</TableCell>
                  <TableCell>{t('users.email')}</TableCell>
                  <TableCell>{t('users.role')}</TableCell>
                  <TableCell>{t('users.status')}</TableCell>
                  <TableCell>{t('users.lastLogin')}</TableCell>
                  <TableCell>{t('users.createdAt')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} sx={{ mr: 2 }} />
                          <Typography variant="body2">
                            {user.firstName} {user.lastName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleChip(user.role)}</TableCell>
                      <TableCell>{getStatusChip(user.status)}</TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('common.actions')}>
                          <IconButton
                            aria-label="actions"
                            aria-controls="user-menu"
                            aria-haspopup="true"
                            onClick={(event) => handleMenuOpen(event, user)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {searchTerm ? t('users.noUsersFound') : t('users.noUsers')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </Paper>
        
        <Typography variant="body2" color="text.secondary">
          {t('users.totalCount', { count: users.length })}
        </Typography>
      </Box>
      
      {/* User Actions Menu */}
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRoleClick}>
          <ListItemIcon>
            <AdminIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('users.changeRole')} />
        </MenuItem>
        <MenuItem onClick={handleStatusClick}>
          <ListItemIcon>
            <BlockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('users.changeStatus')} />
        </MenuItem>
        <MenuItem component={Link} to={`/users/${selectedUser?.id}`} onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('common.edit')} />
        </MenuItem>
        <MenuItem onClick={() => window.location.href = `mailto:${selectedUser?.email}`}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('common.email')} />
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('common.delete')} />
        </MenuItem>
      </Menu>
      
      {/* Delete User Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>{t('users.deleteUserTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedUser && t('users.deleteUserMessage', { name: `${selectedUser.firstName} ${selectedUser.lastName}` })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Change Role Dialog */}
      <Dialog
        open={openRoleDialog}
        onClose={handleCloseRoleDialog}
      >
        <DialogTitle>{t('users.changeRoleTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {selectedUser && t('users.changeRoleMessage', { name: `${selectedUser.firstName} ${selectedUser.lastName}` })}
          </DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<AdminIcon />}
              onClick={() => handleConfirmRoleChange('admin')}
              color="error"
            >
              {t('users.roleAdmin')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<AdminIcon />}
              onClick={() => handleConfirmRoleChange('moderator')}
              color="warning"
            >
              {t('users.roleModerator')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              onClick={() => handleConfirmRoleChange('user')}
              color="primary"
            >
              {t('users.roleUser')}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog}>
            {t('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Change Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
      >
        <DialogTitle>{t('users.changeStatusTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {selectedUser && t('users.changeStatusMessage', { name: `${selectedUser.firstName} ${selectedUser.lastName}` })}
          </DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleConfirmStatusChange('active')}
              color="success"
            >
              {t('users.statusActive')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleConfirmStatusChange('inactive')}
            >
              {t('users.statusInactive')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleConfirmStatusChange('pending')}
              color="info"
            >
              {t('users.statusPending')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<BlockIcon />}
              onClick={() => handleConfirmStatusChange('blocked')}
              color="error"
            >
              {t('users.statusBlocked')}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>
            {t('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersList;