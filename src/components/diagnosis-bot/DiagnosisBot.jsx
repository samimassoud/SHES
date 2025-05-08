import React, { useState, useRef, useEffect } from 'react';
import BotMessage from './BotMessage';
import SymptomAnalyzer from './SymptomAnalyzer';
import './Diagnosis-bot.css';

const DiagnosisBot = ({ onBookAppointment }) => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your medical assistant. Please describe your symptoms in detail.",
      sender: 'bot',
      isDiagnosis: false,
      isQuestion: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const [analyzer] = useState(new SymptomAnalyzer());
  const [awaitingAnswer, setAwaitingAnswer] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() && !awaitingAnswer) return;

    // Add user message
    const userMessage = { 
      text: awaitingAnswer ? `Answer: ${inputValue}` : inputValue, 
      sender: 'user' 
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Process response
    try {
      const response = await analyzer.analyzeInput(inputValue);
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
      setAwaitingAnswer(response.isQuestion);
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      setMessages(prev => [...prev, {
        text: "I encountered an error processing your symptoms. Please try again.",
        sender: 'bot',
        isDiagnosis: false,
        isQuestion: false
      }]);
      setAwaitingAnswer(false);
    }
  };

  const handleAnswerQuestion = (answer) => {
    setInputValue(answer);
    setAwaitingAnswer(false);
    handleSend();
  };

  const handleClear = () => {
    analyzer.resetConversation();
    setMessages([{ 
      text: "Hello! I'm your medical assistant. Please describe your symptoms in detail.",
      sender: 'bot',
      isDiagnosis: false,
      isQuestion: false
    }]);
    setAwaitingAnswer(false);
  };

  return (
    <div className="diagnosis-bot">
      <div className="messages-container">
        {messages.map((msg, i) => (
          <BotMessage 
            key={i} 
            message={msg}
            onBookAppointment={onBookAppointment}
            onAnswerQuestion={handleAnswerQuestion}
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
          placeholder={awaitingAnswer ? "Answer the question..." : "Describe your symptoms..."}
          disabled={awaitingAnswer}
        />
        {awaitingAnswer ? (
          <button className="send-btn" onClick={handleSend}>
            Submit
          </button>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default DiagnosisBot;