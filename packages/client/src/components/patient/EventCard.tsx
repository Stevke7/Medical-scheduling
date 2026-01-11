import React from 'react';
import { formatToLocalTime } from '../../utils/timezone.utils';

interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  doctorName: string;
}

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = formatToLocalTime(event.startTime, 'EEEE, MMMM d, yyyy');
  const formattedStartTime = formatToLocalTime(event.startTime, 'h:mm a');
  const formattedEndTime = formatToLocalTime(event.endTime, 'h:mm a');

  return (
    <div className="event-card">
      <h4>{event.title}</h4>
      <p>
        <strong>Doctor:</strong> {event.doctorName}
      </p>
      <p>
        <strong>Date:</strong> {formattedDate}
      </p>
      <p className="event-time">
        {formattedStartTime} - {formattedEndTime}
      </p>
    </div>
  );
};
