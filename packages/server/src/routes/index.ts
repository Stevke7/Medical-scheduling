import { Router } from 'express';
import clinicRoutes from './clinic.routes.js';
import patientRoutes from './patient.routes.js';

const router = Router();

router.use('/clinic', clinicRoutes);
router.use('/patient', patientRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
