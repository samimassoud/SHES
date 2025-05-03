import React, { useState, useRef, useEffect } from 'react';
import BotMessage from './BotMessage';
import SymptomAnalyzer from './SymptomMapper';
import './Diagnosis-bot.css';

const DiagnosisBot = ({ onBookAppointment }) => {
    const [messages, setMessages] = useState([
      { 
        text: "Hello! Please describe your symptoms.", // Default English
        sender: 'bot',
        isDiagnosis: false 
      }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [analyzer] = useState(new SymptomAnalyzer());

// const handleSend = () => {
//   if (!inputValue.trim()) return;

//   // Add user message
//   setMessages(prev => [...prev, { 
//     text: inputValue, 
//     sender: 'user' 
//   }]);
//   setInputValue('');

//   // Get bot response
//   setTimeout(() => {
//     const response = analyzer.analyzeInput(inputValue);
    
//     setMessages(prev => [...prev, {
//       text: response.text,
//       sender: 'bot',
//       isQuestion: response.isQuestion,
//       ...(response.isDiagnosis && {
//         isDiagnosis: true,
//         reasoning: response.reasoning,
//         specialty: response.specialty
//       })
//     }]);
//   }, 1000);
// };

const handleSend = () => {
    if (!inputValue.trim()) return;
  
    // Add user message
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
  
    // Process response
    setTimeout(() => {
      const response = analyzer.analyzeInput(inputValue);
      
      const botMessage = {
        text: response.text,
        sender: 'bot',
        isQuestion: response.isQuestion,
        ...(response.isDiagnosis && {
          isDiagnosis: true,
          reasoning: response.reasoning,
          specialty: response.specialty
        })
      };
  
      setMessages(prev => [...prev, botMessage]);
  
      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }, 1000);
  };

  const handleClear = () => {
    analyzer.reset();
    setMessages([{ 
      text: "Hello! Please describe your symptoms.", 
      sender: 'bot',
      isDiagnosis: false 
    }]);
  };

  return (
    <div className="diagnosis-bot">
      <div className="messages-container">
        {messages.map((msg, i) => (
          <BotMessage 
            key={i} 
            message={msg}
            onBookAppointment={onBookAppointment}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Describe your symptoms..."
        />
        <button 
          className="clear-btn"
          onClick={handleClear}
          title="Clear conversation"
        >
          ×
        </button>
        <button className="send-btn" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default DiagnosisBot;