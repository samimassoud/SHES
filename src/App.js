// src/App.js

import React from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ITDashboard from './pages/ITDashboard';
import AdminDashboard from './pages/AdminDashboard';







// (Later we will import AboutPage, ContactPage, SignupPage too)

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/it-dashboard" element={<ITDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Later we'll add About, Contact, Signup routes here */}
      </Routes>
    </>
  );
}

export default App;
