import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useI18n } from '../../contexts/I18nContext';

const LanguageSwitcher = () => {
  const { language, languages, changeLanguage } = useI18n();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    handleClose();
  };
  
  // We don't need to get current language name as it's not being used
  // const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <>
      <Tooltip title="Change language">
        <IconButton
          color="inherit"
          aria-label="change language"
          onClick={handleClick}
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === language}
          >
            <ListItemText primary={lang.name} />
            {lang.code === language && (
              <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                <span>✓</span>
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;