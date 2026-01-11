import { Request, Response } from 'express';
import { EventService } from '../../services/index.js';

export class PatientEventController {
  /**
   * GET /api/patient/events
   * Get all upcoming events for the logged in patient
   * Events are returned in UTC - frontend converts to patient's timezone
   */
  static async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const patient = req.patient!;

      const events = await EventService.getEventsForPatient(patient._id);

      res.json({
        success: true,
        events: events.map(e => ({
          _id: e._id.toString(),
          title: e.title,
          // Return ISO strings - frontend will convert to patient's local timezone
          startTime: e.startTime.toISOString(),
          endTime: e.endTime.toISOString(),
          // Include doctor name (populated)
          doctorName: (e.doctorId as unknown as { name: string }).name,
        })),
      });
    } catch (error) {
      console.error('Get patient events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get events',
      });
    }
  }
}
