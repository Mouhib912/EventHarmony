import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language resources
import enTranslation from '../locales/en.json';
import frTranslation from '../locales/fr.json';
import arTranslation from '../locales/ar.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      ar: { translation: arTranslation },
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

const I18nContext = createContext();

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);

  // Available languages
  const languages = [
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'fr', name: 'Français', dir: 'ltr' },
    { code: 'ar', name: 'العربية', dir: 'rtl' },
  ];

  // Get current language details
  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  // Change language
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    localStorage.setItem('language', langCode);
    
    // Set document direction based on language
    const lang = languages.find((l) => l.code === langCode);
    if (lang) {
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = langCode;
    }
  };

  // Set initial document direction
  useEffect(() => {
    document.documentElement.dir = currentLanguage.dir;
    document.documentElement.lang = language;
  }, [currentLanguage.dir, language]);

  const value = {
    language,
    languages,
    currentLanguage,
    changeLanguage,
    t: i18n.t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};