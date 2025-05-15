// src/pages/LoginPage.js

import React, { useState, useContext } from 'react';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import {users} from '../mocks/mockData';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation'

function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.id === identifier && u.password === password);
    
    if (user) {
      login(user); // Store user in context
      console.log(`Logging in as ${user.role}`);
      navigate(`/${user.role}-dashboard`);
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  const t = useTranslation();
  return (
    <div className='login-page-wrapper'>
    <div className="login-container">
      <h2 dir="rtl">{t('login_to_shes')}</h2>
      <form onSubmit={handleLogin} className="login-form">
  <div className="form-group">
    <label htmlFor="idInput">{t('id_number')}</label>
    <input
      id="idInput"
      type="text"
      placeholder={t('enter_id')}
      value={identifier}
      onChange={(e) => setIdentifier(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="passwordInput">{t('password')}</label>
    <input
      id="passwordInput"
      type="password"
      placeholder={t('enter_password')}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>

  <button type="submit">{t('login')}</button>
</form>

      <p className="signup-link">
        {t('signup_prompt')} <a href="/signup">{t('signup_link')}</a>
      </p>
    </div>
    </div>
  );
}

export default LoginPage;
