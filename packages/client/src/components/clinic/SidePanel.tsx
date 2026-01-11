import React from 'react';
import { EventForm } from './EventForm';
import { BatchEventForm } from './BatchEventForm';

type PanelMode = 'none' | 'single' | 'batch';

interface SidePanelProps {
  mode: PanelMode;
  selectedDate: Date | null;
  onEventCreated: () => void;
  onClose: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  mode,
  selectedDate,
  onEventCreated,
  onClose,
}) => {
  if (mode === 'none') {
    return (
      <div className="side-panel">
        <div className="side-panel-placeholder">
          <div>
            <h3>📅</h3>
            <p>Select a day from the calendar to create an event</p>
            <p style={{ marginTop: '10px', fontSize: '14px' }}>
              Or click "Add Batch Events" to create multiple events at once
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'batch') {
    return <BatchEventForm onEventsCreated={onEventCreated} onClose={onClose} />;
  }

  if (mode === 'single' && selectedDate) {
    return (
      <EventForm
        selectedDate={selectedDate}
        onEventCreated={onEventCreated}
        onClose={onClose}
      />
    );
  }

  return null;
};
