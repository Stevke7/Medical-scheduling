import React, { useState, useEffect } from 'react';
import { createEvent, getPatients } from '../../api/clinic.api';
import { formatDateForInput, combineDateAndTime } from '../../utils/timezone.utils';
import { format } from 'date-fns';

interface Patient {
  _id: string;
  name: string;
  email: string;
}

interface EventFormProps {
  selectedDate: Date;
  onEventCreated: () => void;
  onClose: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  selectedDate,
  onEventCreated,
  onClose,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [patientId, setPatientId] = useState('');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await getPatients();
      if (response.success) {
        setPatients(response.patients);
      }
    } catch (err) {
      console.error('Failed to load patients:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!patientId || !title || !time) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const dateStr = formatDateForInput(selectedDate);
      const startTime = combineDateAndTime(dateStr, time);

      const response = await createEvent({
        patientId,
        title,
        startTime,
      });

      if (response.success) {
        onEventCreated();
        // Reset form
        setPatientId('');
        setTitle('');
        setTime('09:00');
      } else {
        setError(response.message || 'Failed to create event');
      }
    } catch (err) {
      setError('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="side-panel">
      <h3>Create Event for {format(selectedDate, 'MMMM d, yyyy')}</h3>

      {error && <div className="login-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
          >
            <option value="">Select a patient...</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name} ({patient.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Annual Checkup"
            required
          />
        </div>

        <div className="form-group">
          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '15px' }}>
          Duration: 30 minutes (ends at {time ? (() => {
            const [h, m] = time.split(':').map(Number);
            const endMinutes = h * 60 + m + 30;
            const endH = Math.floor(endMinutes / 60) % 24;
            const endM = endMinutes % 60;
            return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
          })() : '--:--'})
        </p>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          style={{ marginLeft: '10px' }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};
