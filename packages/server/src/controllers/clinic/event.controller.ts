import { Request, Response } from 'express';
import { EventService, NotificationService } from '../../services/index.js';
import { Patient } from '../../models/index.js';
import { IEventCreate, IEventBatchCreate } from '@medical/shared';
import { addDaysToDate } from '../../utils/date.utils.js';

export class ClinicEventController {
  /**
   * POST /api/clinic/events
   * Create a single event
   */
  static async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const data: IEventCreate = req.body;
      const user = req.user!;

      if (!data.title || !data.patientId || !data.startTime) {
        res.status(400).json({
          success: false,
          message: 'Title, patient, and start time are required',
        });
        return;
      }

      // Verify patient exists
      const patient = await Patient.findById(data.patientId);
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient not found',
        });
        return;
      }

      const event = await EventService.createEvent(
        data,
        user._id,
        user.timezone
      );

      // Notify patient
      NotificationService.notifyNewEvent(event, user.name);

      res.status(201).json({
        success: true,
        event: {
          _id: event._id.toString(),
          title: event.title,
          startTime: event.startTime.toISOString(),
          endTime: event.endTime.toISOString(),
          patientId: event.patientId.toString(),
        },
      });
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create event',
      });
    }
  }

  /**
   * POST /api/clinic/events/batch
   * Create multiple events at once
   */
  static async createBatchEvents(req: Request, res: Response): Promise<void> {
    try {
      const data: IEventBatchCreate = req.body;
      const user = req.user!;

      if (!data.title || !data.patientId || !data.startDate || !data.endDate || !data.time) {
        res.status(400).json({
          success: false,
          message: 'Title, patient, start date, end date, and time are required',
        });
        return;
      }

      // Verify patient exists
      const patient = await Patient.findById(data.patientId);
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient not found',
        });
        return;
      }

      const events = await EventService.createBatchEvents(
        data,
        user._id,
        user.timezone
      );

      // Notify patient about all new events
      NotificationService.notifyBatchEventsCreated(
        events,
        data.patientId,
        user.name
      );

      res.status(201).json({
        success: true,
        message: `Created ${events.length} events`,
        count: events.length,
        events: events.map(e => ({
          _id: e._id.toString(),
          title: e.title,
          startTime: e.startTime.toISOString(),
          endTime: e.endTime.toISOString(),
        })),
      });
    } catch (error) {
      console.error('Create batch events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create batch events',
      });
    }
  }

  /**
   * GET /api/clinic/events
   * Get events for the logged in doctor
   * Query params: startDate, endDate (optional, defaults to 3 months ahead)
   */
  static async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      
      // Default: from today to 3 months ahead
      const startDate = req.query.startDate 
        ? new Date(req.query.startDate as string)
        : new Date();
      
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : addDaysToDate(new Date(), 90);

      const events = await EventService.getEventsByDoctor(
        user._id,
        startDate,
        endDate
      );

      res.json({
        success: true,
        events: events.map(e => ({
          _id: e._id.toString(),
          title: e.title,
          startTime: e.startTime.toISOString(),
          endTime: e.endTime.toISOString(),
          patient: e.patientId,
        })),
      });
    } catch (error) {
      console.error('Get events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get events',
      });
    }
  }

  /**
   * GET /api/clinic/events/days-with-events
   * Get dates that have events (for calendar highlighting)
   */
  static async getDaysWithEvents(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user!;
      
      const startDate = req.query.startDate 
        ? new Date(req.query.startDate as string)
        : new Date();
      
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : addDaysToDate(new Date(), 90);

      const dates = await EventService.getDaysWithEvents(
        user._id,
        startDate,
        endDate
      );

      res.json({
        success: true,
        dates: dates.map(d => d.toISOString()),
      });
    } catch (error) {
      console.error('Get days with events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get days with events',
      });
    }
  }

  /**
   * GET /api/clinic/patients
   * Get all patients (for dropdown in event form)
   */
  static async getPatients(req: Request, res: Response): Promise<void> {
    try {
      const patients = await Patient.find().select('name email').sort({ name: 1 });

      res.json({
        success: true,
        patients: patients.map(p => ({
          _id: p._id.toString(),
          name: p.name,
          email: p.email,
        })),
      });
    } catch (error) {
      console.error('Get patients error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get patients',
      });
    }
  }
}
