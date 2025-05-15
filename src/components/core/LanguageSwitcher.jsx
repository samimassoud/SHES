import React from 'react';
import { useLanguage } from '../../context/LanguageContext'; // Changed from LanguageContext
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage(); // Changed from useContext

  return (
    <div className="language-switcher">
      <button onClick={toggleLanguage}>
        {language === 'en' ? 'العربية' : 'English'}
      </button>
    </div>
  );
}

export default LanguageSwitcher;