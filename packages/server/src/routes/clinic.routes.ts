import { Router } from 'express';
import { ClinicAuthController } from '../controllers/clinic/auth.controller.js';
import { ClinicEventController } from '../controllers/clinic/event.controller.js';
import { clinicAuthMiddleware } from '../middlewares/index.js';

const router = Router();

// Auth routes (no auth required)
router.post('/auth/login', ClinicAuthController.login);
router.post('/auth/logout', ClinicAuthController.logout);
router.get('/auth/status', ClinicAuthController.status);

// Protected routes (require clinic auth)
router.use(clinicAuthMiddleware);

// Event routes
router.get('/events', ClinicEventController.getEvents);
router.get('/events/days-with-events', ClinicEventController.getDaysWithEvents);
router.post('/events', ClinicEventController.createEvent);
router.post('/events/batch', ClinicEventController.createBatchEvents);

// Patient list (for dropdown)
router.get('/patients', ClinicEventController.getPatients);

export default router;
