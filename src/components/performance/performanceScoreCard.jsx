import React from 'react';
import { patientFeedback, doctors } from '../../mocks/mockData';
import './PerformanceScoreCard.css';

function PerformanceScoreCard({ doctorId }) {
  const doctor = doctors.find(d => d.id === doctorId);
  const feedback = patientFeedback.filter(f => f.DoctorID === doctorId);

  const averageRating = feedback.reduce((acc, curr) => acc + curr.Rating, 0) / feedback.length;

  return (
    <div className="performance-card">
      <h3>Performance Metrics</h3>
      <div className="metric">
        <span>Average Rating:</span>
        <div className="stars">
          {'★'.repeat(Math.round(averageRating))}
          {'☆'.repeat(5 - Math.round(averageRating))}
          <span>({averageRating.toFixed(1)})</span>
        </div>
      </div>
      <div className="metric">
        <span>Feedback Count:</span>
        <span>{feedback.length}</span>
      </div>
    </div>
  );
}

export default PerformanceScoreCard;