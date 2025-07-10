import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LoadingFallback = () => {
  const { t } = useTranslation();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        minHeight: '300px',
        p: 4
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        {t('common.loading')}
      </Typography>
    </Box>
  );
};

export default LoadingFallback;