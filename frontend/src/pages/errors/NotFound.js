import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center' }}>
        <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          {t('errors.notFoundTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('errors.notFoundMessage')}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            color="primary"
          >
            {t('common.backToDashboard')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;