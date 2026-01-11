import React, { useState, useEffect } from 'react';
import { createBatchEvents, getPatients } from '../../api/clinic.api';
import { formatDateForInput } from '../../utils/timezone.utils';
import { addDays, differenceInDays } from 'date-fns';

interface Patient {
  _id: string;
  name: string;
  email: string;
}

interface BatchEventFormProps {
  onEventsCreated: () => void;
  onClose: () => void;
}

export const BatchEventForm: React.FC<BatchEventFormProps> = ({
  onEventsCreated,
  onClose,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [patientId, setPatientId] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(formatDateForInput(new Date()));
  const [endDate, setEndDate] = useState(formatDateForInput(addDays(new Date(), 4)));
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

  const calculateEventCount = (): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = differenceInDays(end, start);
    return diff >= 0 ? diff + 1 : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!patientId || !title || !startDate || !endDate || !time) {
      setError('Please fill in all fields');
      return;
    }

    const eventCount = calculateEventCount();
    if (eventCount <= 0) {
      setError('End date must be on or after start date');
      return;
    }

    if (eventCount > 90) {
      setError('Cannot create more than 90 events at once');
      return;
    }

    setLoading(true);

    try {
      const response = await createBatchEvents({
        patientId,
        title,
        startDate,
        endDate,
        time,
      });

      if (response.success) {
        onEventsCreated();
        // Reset form
        setPatientId('');
        setTitle('');
        setStartDate(formatDateForInput(new Date()));
        setEndDate(formatDateForInput(addDays(new Date(), 4)));
        setTime('09:00');
      } else {
        setError(response.message || 'Failed to create events');
      }
    } catch (err) {
      setError('Failed to create events');
    } finally {
      setLoading(false);
    }
  };

  const eventCount = calculateEventCount();

  return (
    <div className="side-panel">
      <h3>Create Batch Events</h3>

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
          <label>Title (for all events)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Daily Physical Therapy"
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={formatDateForInput(new Date())}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            required
          />
        </div>

        <div className="form-group">
          <label>Time (same for all days)</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div
          style={{
            background: '#e8f4fd',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '15px',
          }}
        >
          <strong>Summary:</strong>
          <p>
            This will create <strong>{eventCount}</strong> event(s), one for each day from{' '}
            {startDate} to {endDate} at {time}.
          </p>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
            Each event lasts 30 minutes.
          </p>
        </div>

        <button type="submit" className="btn btn-success" disabled={loading || eventCount <= 0}>
          {loading ? 'Creating...' : `Create ${eventCount} Event(s)`}
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
