// src/pages/DoctorDashboard.js

import React, {useState} from 'react';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/DoctorDashboard.css';
import { appointments, medicalHistory } from '../mocks/mockData';
import ApprovalRequestForm from '../components/approvals/ApprovalRequestForm';
import MedicalHistorySection from '../components/patient/MedicalHistorySection';

function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewingHistory, setViewingHistory] = useState(false);

  const doctorAppointments = appointments.filter(
    appt => appt.doctorId === "2001" // Replace with logged-in doctor's ID
  );

  // Get medical history for selected patient (only if they have appointments with this doctor)
  const getPatientHistory = () => {
    if (!selectedPatient) return [];
    return medicalHistory.filter(
      record => record.PatientID === selectedPatient.id
    );
  };

  const handleCompleteAppointment = (appointmentId) => {
  // In real app, this would update backend
  console.log('Marking appointment as completed:', appointmentId);
  
  // Update local state
  setAppointments(appointments.map(appt => 
    appt.id === appointmentId ? { ...appt, status: 'completed' } : appt
  ));
};

const handleRequestSubmit = async (requestData) => {
  try {
    console.log('Submitting doctor absence request:', requestData);
    
    // In real app, this would be:
    // const response = await api.post('/approvals/absence', requestData);
    
    alert('Absence request submitted for approval');
  } catch (error) {
    console.error('Request submission failed:', error);
    alert('Failed to submit request');
  }
};

  return (
    <div className="doctor-dashboard-container">
      <h1>Welcome, Doctor</h1>
      <ApprovalRequestForm 
      userId="2001" // Doctor's ID
      userRole="doctor"
      onSubmit={handleRequestSubmit}
      requestType="absence"
    />

    {viewingHistory ? (
        <div className="patient-history-view">
          <button 
            className="back-button"
            onClick={() => {
              setViewingHistory(false);
              setSelectedPatient(null);
            }}
          >
            ← Back to Appointments
          </button>
          <h2>Medical History for {selectedPatient?.name}</h2>
          <MedicalHistorySection 
            patientId={selectedPatient?.id} 
            records={getPatientHistory()}
            viewMode="doctor"
          />
        </div>
      ) : (
      <div className="cards-grid">
        {appointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            title={`Patient: ${appt.patientName}`}
            subtitle={appt.purpose}
            date={appt.date}
            daysLeft={appt.daysLeft}
            role="doctor"
            status={appt.status}
            onAction={(action) => {
              if (action === 'Mark as Completed') {
                handleCompleteAppointment(appt.id);
              }
            }}
            onViewHistory={()=>{
              setSelectedPatient({
                id: appt.patientId,
                name: appt.patientName  
              });
              setViewingHistory(true);
            }}
          />
        ))}
      </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
