import React from 'react';
import { medicalHistory } from '../../mocks/mockData';
import './MedicalHistorySection.css';

function MedicalHistorySection({ patientId }) {
  const records = medicalHistory.filter(record => record.PatientID === patientId);

  return (
    <div className="medical-history">
      <h3>Medical History</h3>
      {records.length === 0 ? (
        <p>No records found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.RecordID}>
                <td>{new Date(record.Date).toLocaleDateString()}</td>
                <td>{record.Diagnosis}</td>
                <td>{record.Prescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MedicalHistorySection;