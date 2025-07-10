import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const drawerWidth = 240;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Header */}
      <Header 
        drawerWidth={drawerWidth} 
        handleDrawerToggle={handleDrawerToggle} 
      />
      
      {/* Sidebar */}
      <Sidebar 
        drawerWidth={drawerWidth} 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
      />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Toolbar /> {/* This empty Toolbar pushes content below the AppBar */}
        <Outlet /> {/* Renders the current route */}
      </Box>
    </Box>
  );
};

export default MainLayout;