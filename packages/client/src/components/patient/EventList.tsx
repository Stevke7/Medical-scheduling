import React from 'react';
import { EventCard } from './EventCard';

interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  doctorName: string;
}

interface EventListProps {
  events: Event[];
  loading: boolean;
}

export const EventList: React.FC<EventListProps> = ({ events, loading }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="empty-state">
        <h3>📅 No Upcoming Appointments</h3>
        <p>You don't have any scheduled appointments at this time.</p>
        <p>Your doctor will schedule appointments for you.</p>
      </div>
    );
  }

  return (
    <div className="event-list">
      <h2 style={{ marginBottom: '20px' }}>Your Upcoming Appointments</h2>
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};
