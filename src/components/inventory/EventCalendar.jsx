import React, { useState } from 'react';
import { events } from '../../mocks/mockData';
import './EventCalendar.css';
import { getEventCriticalItems } from './inventoryLogic';
import { warehouseItems } from '../../mocks/mockData';

function EventCalendar() {
  const [highlightedItems, setHighlightedItems] = useState([]);

  const handleEventClick = (eventName) => {
    setHighlightedItems(getEventCriticalItems(warehouseItems, eventName));
  };
  // before return is NEW  
  return (
    <div className="event-calendar">
      <h3>Upcoming Events</h3>
      <ul>
        {events.map(event => (
          <li 
            key={event.EventID} 
            className="event-item"
            onClick={() => handleEventClick(event.EventName)}
          >
            <span className="event-name">{event.EventName}</span>
            <span className="event-dates">
              {new Date(event.StartDate).toLocaleDateString()} - 
              {new Date(event.EndDate).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
      {highlightedItems.length > 0 && (
        <div className="event-highlight">
          <strong>Affected Items:</strong> 
          {highlightedItems.map(item => item.ItemName).join(', ')}
        </div>
      )}
    </div>
  );
}

export default EventCalendar;