import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        name: string;
        timezone: string;
      };
    }
  }
}

// Extend session to include our data
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    patientId?: string;
    userType?: 'clinic' | 'patient';
  }
}

/**
 * Middleware to protect clinic routes
 * Checks if user is logged in as clinic user
 */
export const clinicAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if session has userId and is clinic type
    if (!req.session.userId || req.session.userType !== 'clinic') {
      res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - Please login as clinic user' 
      });
      return;
    }

    // Fetch user data
    const user = await AuthService.getClinicUserById(req.session.userId);
    
    if (!user) {
      // User no longer exists, clear session
      req.session.destroy(() => {});
      res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    // Attach user to request
    req.user = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      timezone: user.timezone,
    };

    next();
  } catch (error) {
    console.error('Clinic auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};
