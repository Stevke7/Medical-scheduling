// Socket events emitted from server to client
export enum ServerToClientEvents {
  NEW_EVENT_CREATED = 'new_event_created',
  EVENT_REMINDER = 'event_reminder',
  CONNECTED = 'connected',
}

// Socket events emitted from client to server
export enum ClientToServerEvents {
  JOIN_PATIENT_ROOM = 'join_patient_room',
  LEAVE_PATIENT_ROOM = 'leave_patient_room',
}

// Payload for new event notification
export interface INewEventPayload {
  eventId: string;
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  doctorName: string;
}

// Payload for reminder notification
export interface IReminderPayload {
  eventId: string;
  title: string;
  startTime: string; // ISO string
  doctorName: string;
  minutesUntilStart: number;
}

// Socket auth data
export interface ISocketAuth {
  oderId?: string;
  userType: 'clinic' | 'patient';
}
