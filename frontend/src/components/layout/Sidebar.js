import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  People as PeopleIcon,
  MeetingRoom as MeetingIcon,
  Settings as SettingsIcon,
  BarChart as AnalyticsIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const location = useLocation();
  const { t } = useTranslation();

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const items = [
      {
        text: t('dashboard.title'),
        icon: <DashboardIcon />,
        path: '/dashboard',
        roles: ['admin', 'product_owner', 'client', 'staff', 'participant'],
      },
      {
        text: t('events.title'),
        icon: <EventIcon />,
        path: '/events',
        roles: ['admin', 'product_owner', 'client', 'staff', 'participant'],
      },
      {
        text: t('meetings.title'),
        icon: <MeetingIcon />,
        path: '/meetings',
        roles: ['admin', 'product_owner', 'client', 'staff', 'participant'],
      },
    ];

    // Add admin/product owner specific items
    if (user?.role === 'admin' || user?.role === 'product_owner') {
      items.push(
        {
          text: t('users.title'),
          icon: <PeopleIcon />,
          path: '/users',
          roles: ['admin', 'product_owner'],
        },
        {
          text: t('events.statistics.title'),
          icon: <AnalyticsIcon />,
          path: '/analytics',
          roles: ['admin', 'product_owner'],
        },
        {
          text: t('common.settings'),
          icon: <SettingsIcon />,
          path: '/settings',
          roles: ['admin', 'product_owner'],
        },
      );
    }

    // Add help item for all users
    items.push({
      text: t('common.help'),
      icon: <HelpIcon />,
      path: '/help',
      roles: ['admin', 'product_owner', 'client', 'staff', 'participant'],
    });

    return items.filter(item => item.roles.includes(user?.role));
  };

  const navigationItems = getNavigationItems();

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          {t('app.name')}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.action.selected,
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;