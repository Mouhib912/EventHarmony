import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  
  return (
    <Tooltip title={mode === 'dark' ? t('common.lightMode') : t('common.darkMode')}>
      <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;