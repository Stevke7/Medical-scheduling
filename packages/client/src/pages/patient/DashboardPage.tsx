import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { EventList } from '../../components/patient/EventList';
import { getPatientEvents } from '../../api/patient.api';
import { useNotifications } from '../../components/common/Notification';
import { formatToLocalTime } from '../../utils/timezone.utils';

interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  doctorName: string;
}

export const PatientDashboardPage: React.FC = () => {
  const { patient, patientLogout } = useAuth();
  const { joinPatientRoom, leavePatientRoom, onNewEvent, onReminder, isConnected } = useSocket();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification, NotificationContainer } = useNotifications();

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPatientEvents();
      if (response.success) {
        setEvents(response.events);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Join patient room for real-time updates
  useEffect(() => {
    if (patient && isConnected) {
      joinPatientRoom(patient._id);

      return () => {
        leavePatientRoom(patient._id);
      };
    }
  }, [patient, isConnected, joinPatientRoom, leavePatientRoom]);

  // Listen for new events
  useEffect(() => {
    const unsubscribe = onNewEvent((payload) => {
      console.log('New event received:', payload);
      addNotification(
        `New appointment scheduled: ${payload.title} with ${payload.doctorName}`,
        'success'
      );
      // Reload events to get the updated list
      loadEvents();
    });

    return unsubscribe;
  }, [onNewEvent, addNotification, loadEvents]);

  // Listen for reminders
  useEffect(() => {
    const unsubscribe = onReminder((payload) => {
      console.log('Reminder received:', payload);
      const formattedTime = formatToLocalTime(payload.startTime, 'h:mm a');
      addNotification(
        `⏰ Reminder: "${payload.title}" with ${payload.doctorName} starts in ${payload.minutesUntilStart} minutes (at ${formattedTime})`,
        'reminder'
      );
    });

    return unsubscribe;
  }, [onReminder, addNotification]);

  return (
    <div className="app-container">
      <header className="header" style={{ background: '#27ae60' }}>
        <h1>👤 Patient Portal</h1>
        <div className="header-user">
          <span>Welcome, {patient?.name}</span>
          <span style={{ opacity: 0.7 }}>({patient?.timezone})</span>
          {isConnected && (
            <span style={{ 
              background: '#2ecc71', 
              padding: '3px 8px', 
              borderRadius: '10px', 
              fontSize: '12px' 
            }}>
              ● Live
            </span>
          )}
          <button className="btn btn-secondary" onClick={patientLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="card" style={{ marginBottom: '20px', background: '#e8f4fd' }}>
          <p>
            <strong>Your timezone:</strong> {patient?.timezone}
          </p>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
            All appointment times are shown in your local timezone.
          </p>
        </div>

        <EventList events={events} loading={loading} />
      </div>

      <NotificationContainer />
    </div>
  );
};
