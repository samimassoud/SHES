import React from 'react';
import { patientFeedback, appointments, doctors } from '../../mocks/mockData';
import './PerformanceScoreCard.css';

function PerformanceScoreCard({ doctorId }) {
  const doctor = doctors.find(d => d.id === doctorId);
  const feedback = patientFeedback.filter(f => f.DoctorID === doctorId);
  
  // Calculate metrics
  const calculateMetrics = () => {
    // 1. Feedback Score (50% weight)
    const feedbackScore = feedback.reduce((acc, curr) => acc + curr.Rating, 0) / feedback.length || 0;
    
    // 2. Punctuality Score (30% weight)
    const completedAppointments = appointments.filter(
      appt => appt.doctorId === doctorId && appt.status === 'completed'
    );
    const punctualityScore = completedAppointments.length > 0 
      ? (completedAppointments.filter(a => !a.delayed).length / completedAppointments.length * 5 )
      : 0;
    
    // 3. Workload Score (20% weight)
    const currentMonthAppointments = appointments.filter(
      appt => appt.doctorId === doctorId && 
      new Date(appt.date).getMonth() === new Date().getMonth()
    );
    const workloadScore = Math.min(currentMonthAppointments.length / 40 * 5, 5); // Max 40 appointments/month
    
    return {
      feedbackScore: parseFloat(feedbackScore.toFixed(1)),
      punctualityScore: parseFloat(punctualityScore.toFixed(1)),
      workloadScore: parseFloat(workloadScore.toFixed(1)),
      overallScore: parseFloat((
        feedbackScore * 0.5 + 
        punctualityScore * 0.3 + 
        workloadScore * 0.2
      ).toFixed(1))
    };
  };

  const { feedbackScore, punctualityScore, workloadScore, overallScore } = calculateMetrics();

  // Performance trend (last 3 months)
  const getTrend = () => {
    return overallScore > 4.5 ? '↑ Improving' : 
           overallScore > 3.5 ? '→ Stable' : '↓ Needs Attention';
  };

  return (
    <div className="performance-card">
      <h3>Performance Metrics: Dr. {doctor?.name}</h3>
      
      <div className="score-summary">
        <div className="overall-score">
          <span className="score-value">{overallScore}</span>
          <span className="score-max">/5</span>
          <span className={`trend ${getTrend().includes('↑') ? 'up' : getTrend().includes('↓') ? 'down' : ''}`}>
            {getTrend()}
          </span>
        </div>
        <div className="score-details">
          <div className="metric">
            <span>Patient Feedback</span>
            <div className="progress-bar">
              <div 
                className="progress-fill feedback" 
                style={{ width: `${feedbackScore * 20}%` }}
              ></div>
            </div>
            <span>{feedbackScore}</span>
          </div>
          <div className="metric">
            <span>Punctuality</span>
            <div className="progress-bar">
              <div 
                className="progress-fill punctuality" 
                style={{ width: `${punctualityScore * 20}%` }}
              ></div>
            </div>
            <span>{punctualityScore}</span>
          </div>
          <div className="metric">
            <span>Workload Balance</span>
            <div className="progress-bar">
              <div 
                className="progress-fill workload" 
                style={{ width: `${workloadScore * 20}%` }}
              ></div>
            </div>
            <span>{workloadScore}</span>
          </div>
        </div>
      </div>

      {feedback.length > 0 && (
        <div className="feedback-highlights">
          <h4>Recent Feedback:</h4>
          <div className="feedback-scroll">
            {feedback.slice(0, 3).map((item, index) => (
              <div key={index} className="feedback-item">
                <div className="feedback-rating">
                  {'★'.repeat(item.Rating)}{'☆'.repeat(5 - item.Rating)}
                </div>
                <p className="feedback-comment">
                  {item.Comment || "No comment provided"}
                </p>
                <div className="feedback-date">
                  {new Date(item.Date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceScoreCard;