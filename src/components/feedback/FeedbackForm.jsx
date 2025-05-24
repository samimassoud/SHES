import React, { useState } from 'react';
import './FeedbackForm.css';

const RATING_CATEGORIES = [
  { id: 'professionalism', label: 'Professionalism' },
  { id: 'communication', label: 'Communication' },
  { id: 'wait_time', label: 'Wait Time' },
  { id: 'facility', label: 'Facility Cleanliness' }
];

function FeedbackForm({ appointmentId, onSubmit }) {
  const [rating, setRating] = useState(
    RATING_CATEGORIES.reduce((acc, category) => {
      acc[category.id] = 0;
      return acc;
    }, {}));
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRatingChange = (categoryId, value) => {
    setRatings(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Calculate overall rating (average of categories)
      const overallRating = parseFloat((
        Object.values(ratings).reduce((sum, val) => sum + val, 0) / 
        RATING_CATEGORIES.length
      ).toFixed(1));

      await onSubmit({
        appointmentId,
        ratings: { ...ratings, overall: overallRating },
        comment,
        sentiment: analyzeSentiment(comment) // Basic sentiment analysis
      });

      // Reset form
      setRatings(
        RATING_CATEGORIES.reduce((acc, category) => {
          acc[category.id] = 0;
          return acc;
        }, {})
      );
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Basic sentiment analysis (would use NLP in production)
  const analyzeSentiment = (text) => {
    if (!text) return 'neutral';
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'thank'];
    const negativeWords = ['bad', 'poor', 'angry', 'disappointed', 'unhappy'];
    
    const lowerText = text.toLowerCase();
    if (positiveWords.some(word => lowerText.includes(word))) return 'positive';
    if (negativeWords.some(word => lowerText.includes(word))) return 'negative';
    return 'neutral';
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3>Share Your Experience</h3>
      
      <div className="rating-categories">
        {RATING_CATEGORIES.map(category => (
          <div key={category.id} className="rating-category">
            <label>{category.label}</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${star <= ratings[category.id] ? 'filled' : ''}`}
                  onClick={() => handleRatingChange(category.id, star)}
                  onMouseEnter={() => document.body.style.cursor = 'pointer'}
                  onMouseLeave={() => document.body.style.cursor = 'default'}
                >
                  ★
                </span>
              ))}
              <span className="rating-value">
                ({ratings[category.id] || 'Not rated'})
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="comment-section">
        <label>Additional Comments</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What went well? What could be improved?"
          maxLength={500}
        />
        <div className="comment-meta">
          <span className={`sentiment-preview ${analyzeSentiment(comment)}`}>
            Sentiment: {analyzeSentiment(comment)}
          </span>
          <span>{comment.length}/500</span>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || Object.values(ratings).every(r => r === 0)}
        className="submit-button"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}

export default FeedbackForm;