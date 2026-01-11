import { Router } from 'express';
import { PatientAuthController } from '../controllers/patient/auth.controller.js';
import { PatientEventController } from '../controllers/patient/event.controller.js';
import { patientAuthMiddleware } from '../middlewares/index.js';

const router = Router();

// Auth routes (no auth required)
router.post('/auth/login', PatientAuthController.login);
router.post('/auth/logout', PatientAuthController.logout);
router.get('/auth/status', PatientAuthController.status);

// Protected routes (require patient auth)
router.use(patientAuthMiddleware);

// Event routes
router.get('/events', PatientEventController.getEvents);

export default router;
