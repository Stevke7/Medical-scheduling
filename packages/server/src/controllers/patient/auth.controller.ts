import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service.js';
import { ILoginRequest } from '@medical/shared';

export class PatientAuthController {
  /**
   * POST /api/patient/auth/login
   * Login as patient
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, timezone }: ILoginRequest = req.body;

      if (!email || !password || !timezone) {
        res.status(400).json({
          success: false,
          message: 'Email, password, and timezone are required',
        });
        return;
      }

      const patient = await AuthService.verifyPatient(email, password, timezone);

      if (!patient) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Set session data
      req.session.patientId = patient._id.toString();
      req.session.userType = 'patient';

      res.json({
        success: true,
        patient: {
          _id: patient._id.toString(),
          email: patient.email,
          name: patient.name,
          timezone: patient.timezone,
        },
      });
    } catch (error) {
      console.error('Patient login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
      });
    }
  }

  /**
   * POST /api/patient/auth/logout
   * Logout patient
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      req.session.destroy((err) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: 'Logout failed',
          });
          return;
        }

        res.clearCookie('connect.sid');
        res.json({
          success: true,
          message: 'Logged out successfully',
        });
      });
    } catch (error) {
      console.error('Patient logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  }

  /**
   * GET /api/patient/auth/status
   * Check if patient is authenticated
   */
  static async status(req: Request, res: Response): Promise<void> {
    try {
      if (!req.session.patientId || req.session.userType !== 'patient') {
        res.json({
          authenticated: false,
        });
        return;
      }

      const patient = await AuthService.getPatientById(req.session.patientId);

      if (!patient) {
        res.json({
          authenticated: false,
        });
        return;
      }

      res.json({
        authenticated: true,
        patient: {
          _id: patient._id.toString(),
          email: patient.email,
          name: patient.name,
          timezone: patient.timezone,
        },
      });
    } catch (error) {
      console.error('Auth status error:', error);
      res.status(500).json({
        authenticated: false,
      });
    }
  }
}
