import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { language, toggleLanguage } = useContext(LanguageContext);

  return (
    <div className="language-switcher">
      <button onClick={toggleLanguage}>
        {language === 'en' ? 'العربية' : 'English'}
      </button>
    </div>
  );
}

export default LanguageSwitcher;