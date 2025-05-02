// src/pages/SignupPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupPage.css';

function SignupPage() {
  const [nationalID, setNationalID] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup info:', { nationalID, email });

    // 🌸 Later: Send signup request to server here
    // For now: just redirect softly to Login Page
    alert('Signup request submitted!');
    navigate('/');
  };

  return (
    <div className="signup-container">
      <h2>Signup for SHES System</h2>

      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your National ID"
          value={nationalID}
          onChange={(e) => setNationalID(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit Signup Request</button>
      </form>
    </div>
  );
}

export default SignupPage;
