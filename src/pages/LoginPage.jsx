// src/pages/LoginPage.js

import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulated role check — this will later be connected to your database!
    const fakeUsers = {
      "123": { role: "patient" },
      "456": { role: "doctor" },
      "789": { role: "admin" },
      "999": { role: "it" }
    };

    if (fakeUsers[identifier]) {
      const userRole = fakeUsers[identifier].role;
      console.log(`Logging in as ${userRole}`);

      if (userRole === "patient") navigate("/patient-dashboard");
      else if (userRole === "doctor") navigate("/doctor-dashboard");
      else if (userRole === "admin") navigate("/admin-dashboard");
      else if (userRole === "it") navigate("/it-dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className='login-page-wrapper'>
    <div className="login-container">
      <h2>Login to SHES</h2>
      <form onSubmit={handleLogin} className="login-form">
  <div className="form-group">
    <label htmlFor="idInput">ID Number</label>
    <input
      id="idInput"
      type="text"
      placeholder="Enter your ID"
      value={identifier}
      onChange={(e) => setIdentifier(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="passwordInput">Password</label>
    <input
      id="passwordInput"
      type="password"
      placeholder="Enter your Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>

  <button type="submit">Login</button>
</form>

      <p className="signup-link">
        Don’t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
    </div>
  );
}

export default LoginPage;
