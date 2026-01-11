import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

// Extend Express Request to include patient
declare global {
  namespace Express {
    interface Request {
      patient?: {
        _id: string;
        email: string;
        name: string;
        timezone: string;
      };
    }
  }
}

/**
 * Middleware to protect patient routes
 * Checks if user is logged in as patient
 */
export const patientAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if session has patientId and is patient type
    if (!req.session.patientId || req.session.userType !== 'patient') {
      res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - Please login as patient' 
      });
      return;
    }

    // Fetch patient data
    const patient = await AuthService.getPatientById(req.session.patientId);
    
    if (!patient) {
      // Patient no longer exists, clear session
      req.session.destroy(() => {});
      res.status(401).json({ 
        success: false, 
        message: 'Patient not found' 
      });
      return;
    }

    // Attach patient to request
    req.patient = {
      _id: patient._id.toString(),
      email: patient.email,
      name: patient.name,
      timezone: patient.timezone,
    };

    next();
  } catch (error) {
    console.error('Patient auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};
