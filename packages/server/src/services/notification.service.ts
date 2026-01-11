import { IEventDocument } from '../models/index.js';
import { 
  ServerToClientEvents, 
  INewEventPayload, 
  IReminderPayload 
} from '@medical/shared';
import { emitToPatient, isPatientOnline } from '../config/socket.js';
import { getMinutesUntil, formatForLog } from '../utils/timezone.utils.js';

export class NotificationService {
  /**
   * Notify patient about a new event created for them
   */
  static notifyNewEvent(
    event: IEventDocument,
    doctorName: string
  ): void {
    const patientId = event.patientId.toString();

    const payload: INewEventPayload = {
      eventId: event._id.toString(),
      title: event.title,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime.toISOString(),
      doctorName,
    };

    // Always log for debugging
    console.log(`📅 New event created for patient ${patientId}:`, {
      title: event.title,
      startTime: formatForLog(event.startTime),
      doctor: doctorName,
    });

    // If patient is online, send via socket
    if (isPatientOnline(patientId)) {
      emitToPatient(patientId, ServerToClientEvents.NEW_EVENT_CREATED, payload);
      console.log(`🔔 Notified online patient ${patientId} about new event`);
    }
  }

  /**
   * Send reminder notification for an upcoming event
   * This is called by the scheduler ~5 minutes before event
   */
  static sendReminder(
    event: IEventDocument & { 
      doctorId: { name: string };
      patientId: { _id: string; name: string; email: string; timezone: string };
    }
  ): void {
    const patientId = event.patientId._id.toString();
    const minutesUntil = getMinutesUntil(event.startTime);

    const payload: IReminderPayload = {
      eventId: event._id.toString(),
      title: event.title,
      startTime: event.startTime.toISOString(),
      doctorName: event.doctorId.name,
      minutesUntilStart: minutesUntil,
    };

    // ALWAYS log to console (simulating email/SMS)
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📧 REMINDER NOTIFICATION (simulated email/SMS)');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`  Patient: ${event.patientId.name} (${event.patientId.email})`);
    console.log(`  Patient Timezone: ${event.patientId.timezone}`);
    console.log(`  Event: ${event.title}`);
    console.log(`  Doctor: ${event.doctorId.name}`);
    console.log(`  Time (UTC): ${formatForLog(event.startTime)}`);
    console.log(`  Minutes until start: ${minutesUntil}`);
    console.log('═══════════════════════════════════════════════════════════');

    // If patient is online, also send via socket
    if (isPatientOnline(patientId)) {
      emitToPatient(patientId, ServerToClientEvents.EVENT_REMINDER, payload);
      console.log(`🔔 Sent WebSocket reminder to online patient ${patientId}`);
    } else {
      console.log(`📭 Patient ${patientId} is offline - reminder logged only`);
    }
  }

  /**
   * Notify about batch events created
   */
  static notifyBatchEventsCreated(
    events: IEventDocument[],
    patientId: string,
    doctorName: string
  ): void {
    console.log(`📅 Batch: ${events.length} events created for patient ${patientId}`);

    // Notify patient about each event if online
    if (isPatientOnline(patientId)) {
      events.forEach(event => {
        const payload: INewEventPayload = {
          eventId: event._id.toString(),
          title: event.title,
          startTime: event.startTime.toISOString(),
          endTime: event.endTime.toISOString(),
          doctorName,
        };
        
        emitToPatient(patientId, ServerToClientEvents.NEW_EVENT_CREATED, payload);
      });
      
      console.log(`🔔 Notified online patient about ${events.length} new events`);
    }
  }
}
