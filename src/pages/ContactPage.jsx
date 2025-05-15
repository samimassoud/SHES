// src/pages/ContactPage.js

import React from 'react';
import '../styles/ContactPage.css';
import {useTranslation} from '../hooks/useTranslation'

function ContactPage() {
    const t = useTranslation();
  
  return (
    <div className="contact-container">
      <h1>{t('contact_title')}</h1>
      <p>{t('contact_content.0')}</p>
      <p>{t('contact_content.1')}</p>
      <p>{t('contact_content.2')}</p>
      <p>{t('contact_content.3')}</p>
    </div>
  );
}

export default ContactPage;