import { Router } from 'express';
import {
  getAllPlacements,
  createPlacement,
  applyToPlacement,
  getRecruiterApplications,
  updateApplicationStatus,
} from '../controllers/placementController';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.get('/', verifyToken, getAllPlacements);
router.post('/', verifyToken, requireRoles('recruiter', 'admin'), createPlacement);
router.post('/:placementId/apply', verifyToken, requireRoles('student'), applyToPlacement);
router.get('/applications', verifyToken, requireRoles('recruiter', 'admin'), getRecruiterApplications);
router.put('/applications/:id/status', verifyToken, requireRoles('recruiter', 'admin'), updateApplicationStatus);

export default router;
