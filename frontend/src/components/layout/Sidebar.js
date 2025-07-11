import React, { useState } from 'react';
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
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Videocam as VideocamIcon,
  Settings as SettingsIcon,
  BarChart as AnalyticsIcon,
  Help as HelpIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const navigationConfig = (t) => [
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
    icon: <BusinessIcon />,
    subitems: [
      {
        text: t('meetings.b2b'),
        icon: <BusinessIcon />,
        path: '/meets',
        roles: ['admin', 'product_owner', 'client', 'staff', 'participant'],
      },
      {
        text: t('meetings.online'),
        icon: <VideocamIcon />,
        path: '/online-meetings',
        roles: ['admin', 'product_owner', 'client', 'staff', 'participant'],
      },
    ],
    roles: ['admin', 'product_owner', 'client', 'staff', 'participant'],
  },
  {
    text: t('users.title'),
    icon: <PeopleIcon />,
    path: '/users',
    roles: ['admin'],
  },
  {
    text: t('analytics.title'),
    icon: <AnalyticsIcon />,
    path: '/analytics',
    roles: ['admin', 'product_owner'],
  },
  {
    text: t('settings.title'),
    icon: <SettingsIcon />,
    path: '/settings',
    roles: ['admin', 'product_owner', 'client', 'staff', 'participant'],
  },
  {
    text: t('help.title'),
    icon: <HelpIcon />,
    path: '/help',
    roles: ['admin', 'product_owner', 'client', 'staff', 'participant'],
  },
];

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const location = useLocation();
  const { t } = useTranslation();
  const [meetingsOpen, setMeetingsOpen] = useState(true);

  const handleMeetingsClick = () => {
    setMeetingsOpen(!meetingsOpen);
  };

  const getNavigationItems = () => {
    const items = navigationConfig(t);
    return items.filter((item) => 
      !item.roles || (user && item.roles.includes(user.role)),
    );
  };

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
        {getNavigationItems().map((item) => (
          item.subitems ? (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton onClick={handleMeetingsClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {meetingsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={meetingsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subitems.map((subitem) => (
                    <ListItem key={subitem.text} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={subitem.path}
                        selected={location.pathname === subitem.path}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon>{subitem.icon}</ListItemIcon>
                        <ListItemText primary={subitem.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
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