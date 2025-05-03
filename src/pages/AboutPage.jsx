// src/pages/AboutPage.js

import React from 'react';
import '../styles/AboutPage.css';

function AboutPage() {
  return (
    <div className="about-container">
      <h1>About SHES</h1>
      <p>
        The Smart Hospital Enhancement System (SHES) is designed to optimize hospital operations 
        without replacing the existing Hospital Information System (HIS).
      </p>
      <p>
        SHES focuses on:
      </p>
      <ul>
        <li>AI-powered Smart Scheduling</li>
        <li>Optimized Medical Inventory Management</li>
        <li>Doctor Performance Tracking & Evaluation</li>
        <li>Automated Workflow Approvals</li>
      </ul>
      <p>
        By combining modern technology with a gentle integration approach,
        SHES empowers hospitals to become smarter, faster, and more efficient,
        while keeping their original systems untouched.
      </p>
    </div>
  );
}

export default AboutPage;
