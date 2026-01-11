import { Types } from 'mongoose';
import { Event, IEventDocument, User, Patient } from '../models/index.js';
import { IEventCreate, IEventBatchCreate, EVENT_DURATION_MINUTES } from '@medical/shared';
import { 
  localToUTC, 
  addMinutesToDate, 
  createUTCFromDateAndTime 
} from '../utils/timezone.utils.js';
import { getDateRange } from '../utils/date.utils.js';

export class EventService {
  /**
   * Create a single event
   * 
   * @param data - Event data from request
   * @param doctorId - ID of the doctor creating the event
   * @param doctorTimezone - Doctor's timezone for converting local time to UTC
   */
  static async createEvent(
    data: IEventCreate,
    doctorId: string,
    doctorTimezone: string
  ): Promise<IEventDocument> {
    // Convert doctor's local time to UTC for storage
    const startTimeUTC = localToUTC(data.startTime, doctorTimezone);
    const endTimeUTC = addMinutesToDate(startTimeUTC, EVENT_DURATION_MINUTES);

    const event = new Event({
      title: data.title,
      doctorId: new Types.ObjectId(doctorId),
      patientId: new Types.ObjectId(data.patientId),
      startTime: startTimeUTC,
      endTime: endTimeUTC,
      reminderSent: false,
    });

    await event.save();
    return event;
  }

  /**
   * Create multiple events (batch)
   * Creates one event per day in the date range
   * 
   * @param data - Batch event data
   * @param doctorId - ID of the doctor creating the events
   * @param doctorTimezone - Doctor's timezone
   * @returns Array of created events
   */
  static async createBatchEvents(
    data: IEventBatchCreate,
    doctorId: string,
    doctorTimezone: string
  ): Promise<IEventDocument[]> {
    const dates = getDateRange(data.startDate, data.endDate);
    const events: IEventDocument[] = [];

    for (const dateString of dates) {
      // Create UTC datetime for each date with the specified time
      const startTimeUTC = createUTCFromDateAndTime(
        dateString,
        data.time,
        doctorTimezone
      );
      const endTimeUTC = addMinutesToDate(startTimeUTC, EVENT_DURATION_MINUTES);

      const event = new Event({
        title: data.title,
        doctorId: new Types.ObjectId(doctorId),
        patientId: new Types.ObjectId(data.patientId),
        startTime: startTimeUTC,
        endTime: endTimeUTC,
        reminderSent: false,
      });

      await event.save();
      events.push(event);
    }

    return events;
  }

  /**
   * Get all events for a doctor within a date range
   */
  static async getEventsByDoctor(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IEventDocument[]> {
    return Event.find({
      doctorId: new Types.ObjectId(doctorId),
      startTime: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate('patientId', 'name email')
      .sort({ startTime: 1 });
  }

  /**
   * Get all events for a patient (sorted by nearest first)
   */
  static async getEventsForPatient(patientId: string): Promise<IEventDocument[]> {
    const now = new Date();
    
    return Event.find({
      patientId: new Types.ObjectId(patientId),
      startTime: { $gte: now }, // Only future events
    })
      .populate('doctorId', 'name')
      .sort({ startTime: 1 }); // Nearest first
  }

  /**
   * Get a single event by ID
   */
  static async getEventById(eventId: string): Promise<IEventDocument | null> {
    return Event.findById(eventId)
      .populate('doctorId', 'name')
      .populate('patientId', 'name email timezone');
  }

  /**
   * Get events that need reminders sent
   * Returns events where:
   * - startTime is within the next X minutes
   * - reminderSent is false
   */
  static async getEventsNeedingReminder(
    minutesBefore: number
  ): Promise<IEventDocument[]> {
    const now = new Date();
    const reminderWindow = addMinutesToDate(now, minutesBefore + 1); // +1 for buffer

    return Event.find({
      startTime: {
        $gt: now,
        $lte: reminderWindow,
      },
      reminderSent: false,
    })
      .populate('doctorId', 'name')
      .populate('patientId', 'name email timezone');
  }

  /**
   * Mark event reminder as sent
   */
  static async markReminderSent(eventId: string): Promise<void> {
    await Event.findByIdAndUpdate(eventId, { reminderSent: true });
  }

  /**
   * Check if a day has any events for a doctor
   */
  static async getDaysWithEvents(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Date[]> {
    const events = await Event.find({
      doctorId: new Types.ObjectId(doctorId),
      startTime: {
        $gte: startDate,
        $lte: endDate,
      },
    }).select('startTime');

    return events.map(e => e.startTime);
  }
}
