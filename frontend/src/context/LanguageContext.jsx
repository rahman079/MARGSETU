import React, { createContext, useContext, useState, useEffect } from 'react';
import { REGIONAL_LANGUAGES, NE_STATES, TRANSLATIONS } from '../data/languages';
import { toast } from 'sonner';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLangCode, setCurrentLangCode] = useState(() => {
    try {
      const saved = localStorage.getItem('margsetu_preferred_lang');
      if (saved && REGIONAL_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('Could not read saved language', e);
    }
    return 'en';
  });

  const currentLang = REGIONAL_LANGUAGES.find(l => l.code === currentLangCode) || REGIONAL_LANGUAGES[0];

  const setLanguage = (code) => {
    const selected = REGIONAL_LANGUAGES.find(l => l.code === code);
    if (!selected) return;

    setCurrentLangCode(code);
    try {
      localStorage.setItem('margsetu_preferred_lang', code);
      document.documentElement.lang = code.split('-')[0];
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }

    // Dispatch DOM event for any vanilla components/scripts
    window.dispatchEvent(
      new CustomEvent('margsetu:languageChanged', {
        detail: { language: selected }
      })
    );

    // Friendly feedback toast
    const notif = TRANSLATIONS[code]?.switchNotification || TRANSLATIONS.en.switchNotification;
    toast.success(`${notif} ${selected.name} (${selected.nativeName})`, {
      description: selected.greeting ? `Greeting: "${selected.greeting}"` : `Active across 8 NE States`,
      duration: 3500,
    });
  };

  /**
   * Helper translation function with fallback to English
   */
  const t = (key, fallback = '') => {
    const langDict = TRANSLATIONS[currentLangCode] || TRANSLATIONS.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        currentLangCode,
        setLanguage,
        languages: REGIONAL_LANGUAGES,
        states: NE_STATES,
        t,
        translations: TRANSLATIONS[currentLangCode] || TRANSLATIONS.en,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
