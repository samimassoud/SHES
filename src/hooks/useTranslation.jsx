// src/hooks/useTranslation.js
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../mocks/mockData';

export function useTranslation() {
  const { language } = useLanguage(); // Make sure this isn't undefined
  
  return (key) => {
    // Add debug logging:
    // console.log(`Current language: ${language}, translating key: ${key}`);
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined ) return key;
    }

    if (!result) {
      console.warn(`Missing translation for key: ${key}`);
      return key; // Fallback to the key itself
    }
    return result;
  };
}