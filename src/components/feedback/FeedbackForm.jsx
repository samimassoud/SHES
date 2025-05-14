import React, { useState } from 'react';
import './FeedbackForm.css';

function FeedbackForm({ appointmentId, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ appointmentId, rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3>Rate Your Experience</h3>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={star <= rating ? 'filled' : ''}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Additional comments..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit">Submit Feedback</button>
    </form>
  );
}

export default FeedbackForm;