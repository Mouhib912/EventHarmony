import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
  Settings,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeToggle from '../common/ThemeToggle';

const Header = ({ drawerWidth, handleDrawerToggle }) => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  
  // Profile menu state
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };
  
  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };
  
  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          {t('app.name')}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <Tooltip title={t('common.notifications')}>
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              onClick={handleOpenNotificationsMenu}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Notifications Menu */}
          <Menu
            sx={{ mt: '45px' }}
            id="notifications-menu"
            anchorEl={anchorElNotifications}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotificationsMenu}
          >
            <MenuItem onClick={handleCloseNotificationsMenu}>
              <Typography textAlign="center">New event registration</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseNotificationsMenu}>
              <Typography textAlign="center">Meeting request</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseNotificationsMenu}>
              <Typography textAlign="center">System update</Typography>
            </MenuItem>
          </Menu>
          
          {/* User Profile */}
          <Box sx={{ ml: 2 }}>
            <Tooltip title={t('common.openSettings')}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {user?.profileImage ? (
                  <Avatar alt={user.firstName} src={user.profileImage} />
                ) : (
                  <Avatar>
                    <AccountCircle />
                  </Avatar>
                )}
              </IconButton>
            </Tooltip>
            
            {/* User Menu */}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                <Person sx={{ mr: 1 }} />
                <Typography textAlign="center">{t('users.profile')}</Typography>
              </MenuItem>
              
              <MenuItem component={Link} to="/profile/settings" onClick={handleCloseUserMenu}>
                <Settings sx={{ mr: 1 }} />
                <Typography textAlign="center">{t('common.settings')}</Typography>
              </MenuItem>
              
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                <Typography textAlign="center">{t('auth.logout')}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;