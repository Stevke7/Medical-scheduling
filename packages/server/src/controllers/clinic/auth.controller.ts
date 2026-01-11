import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service.js';
import { ILoginRequest } from '@medical/shared';

export class ClinicAuthController {
  /**
   * POST /api/clinic/auth/login
   * Login as clinic user (doctor)
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

      const user = await AuthService.verifyClinicUser(email, password, timezone);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Set session data
      req.session.userId = user._id.toString();
      req.session.userType = 'clinic';

      res.json({
        success: true,
        user: {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
          timezone: user.timezone,
        },
      });
    } catch (error) {
      console.error('Clinic login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
      });
    }
  }

  /**
   * POST /api/clinic/auth/logout
   * Logout clinic user
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
      console.error('Clinic logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  }

  /**
   * GET /api/clinic/auth/status
   * Check if user is authenticated
   */
  static async status(req: Request, res: Response): Promise<void> {
    try {
      if (!req.session.userId || req.session.userType !== 'clinic') {
        res.json({
          authenticated: false,
        });
        return;
      }

      const user = await AuthService.getClinicUserById(req.session.userId);

      if (!user) {
        res.json({
          authenticated: false,
        });
        return;
      }

      res.json({
        authenticated: true,
        user: {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
          timezone: user.timezone,
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
