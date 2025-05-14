import React from 'react';
import { events } from '../../mocks/mockData';
import './EventCalendar.css';

function EventCalendar() {
  return (
    <div className="event-calendar">
      <h3>Upcoming Events</h3>
      <ul>
        {events.map(event => (
          <li key={event.EventID} className="event-item">
            <span className="event-name">{event.EventName}</span>
            <span className="event-dates">
              {new Date(event.StartDate).toLocaleDateString()} - 
              {new Date(event.EndDate).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventCalendar;