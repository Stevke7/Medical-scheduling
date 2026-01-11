import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar } from '../../components/clinic/Calendar';
import { SidePanel } from '../../components/clinic/SidePanel';
import { getDaysWithEvents } from '../../api/clinic.api';
import { getCalendarDateRange } from '../../utils/date.utils';
import { useNotifications } from '../../components/common/Notification';

type PanelMode = 'none' | 'single' | 'batch';

export const ClinicDashboardPage: React.FC = () => {
  const { clinicUser, clinicLogout } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>('none');
  const [daysWithEvents, setDaysWithEvents] = useState<Date[]>([]);
  const { addNotification, NotificationContainer } = useNotifications();

  const loadDaysWithEvents = useCallback(async () => {
    try {
      const { startDate, endDate } = getCalendarDateRange();
      const response = await getDaysWithEvents(startDate, endDate);
      if (response.success) {
        setDaysWithEvents(response.dates.map((d: string) => new Date(d)));
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  }, []);

  useEffect(() => {
    loadDaysWithEvents();
  }, [loadDaysWithEvents]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setPanelMode('single');
  };

  const handleBatchClick = () => {
    setSelectedDate(null);
    setPanelMode('batch');
  };

  const handleEventCreated = () => {
    loadDaysWithEvents();
    addNotification('Event created successfully!', 'success');
  };

  const handleClosePanel = () => {
    setSelectedDate(null);
    setPanelMode('none');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🏥 Medical Scheduling - Clinic</h1>
        <div className="header-user">
          <span>Welcome, {clinicUser?.name}</span>
          <span style={{ opacity: 0.7 }}>({clinicUser?.timezone})</span>
          <button className="btn btn-secondary" onClick={clinicLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="main-content">
        <div style={{ marginBottom: '15px', textAlign: 'right' }}>
          <button className="btn btn-success" onClick={handleBatchClick}>
            + Add Batch Events
          </button>
        </div>

        <div className="calendar-container">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            daysWithEvents={daysWithEvents}
          />
          <SidePanel
            mode={panelMode}
            selectedDate={selectedDate}
            onEventCreated={handleEventCreated}
            onClose={handleClosePanel}
          />
        </div>
      </div>

      <NotificationContainer />
    </div>
  );
};
