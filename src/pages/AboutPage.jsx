// src/pages/AboutPage.js

import React from 'react';
import '../styles/AboutPage.css';
import {useTranslation} from '../hooks/useTranslation'
function AboutPage() {
  const t = useTranslation();
  return (
    
    <div className="about-container">
      <h1 >{t('about_title')}</h1>
      <p>{t('about_content.0')}</p>
      <p>{t('about_content.1')}</p>
      <ul>
        <li>{t('about_content.3')}</li>
        <li>{t('about_content.4')}</li>
        <li>{t('about_content.5')}</li>
        <li>{t('about_content.6')}</li>
      </ul>
      <p>{t('about_content.2')}</p>
    </div>
  );
}

export default AboutPage;
