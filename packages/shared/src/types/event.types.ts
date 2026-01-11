export interface IEvent {
  _id: string;
  title: string;
  doctorId: string; // Reference to User who created it
  patientId: string; // Reference to Patient
  startTime: Date; // Stored in UTC
  endTime: Date; // Stored in UTC (startTime + 30 minutes)
  reminderSent: boolean; // Whether 5-min reminder was sent
  createdAt: Date;
  updatedAt: Date;
}

// For creating a single event
export interface IEventCreate {
  title: string;
  patientId: string;
  startTime: string; // ISO string - will be converted considering doctor's timezone
}

// For creating batch events
export interface IEventBatchCreate {
  title: string;
  patientId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  time: string; // HH:mm format
}

// For API responses - populated with patient info
export interface IEventPopulated {
  _id: string;
  title: string;
  doctorId: string;
  patient: {
    _id: string;
    name: string;
    email: string;
  };
  startTime: Date;
  endTime: Date;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// For patient view - with localized times
export interface IEventForPatient {
  _id: string;
  title: string;
  doctorName: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  // Frontend will convert to patient's local timezone
}
