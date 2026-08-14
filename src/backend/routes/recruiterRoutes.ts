import { Router } from 'express';
import {
  getRecruiterStats,
  getRecruiterProfile,
  updateRecruiterProfile,
  getRecruiterPlacements,
  createRecruiterPlacement,
  updateRecruiterPlacement,
  closeRecruiterPlacement,
  getRecruiterApplications,
  updateRecruiterApplicationStatus,
  getShortlistedCandidates,
  getInterviewCandidates,
  getRecruiterEvents,
  getRecruiterNotifications,
} from '../controllers/recruiterController';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

// Protect all recruiter routes: only recruiter or admin allowed
router.use(verifyToken, requireRoles('recruiter', 'admin'));

router.get('/stats', getRecruiterStats);
router.get('/profile', getRecruiterProfile);
router.put('/profile', updateRecruiterProfile);

router.get('/placements', getRecruiterPlacements);
router.post('/placements', createRecruiterPlacement);
router.put('/placements/:id', updateRecruiterPlacement);
router.delete('/placements/:id', closeRecruiterPlacement);

router.get('/applications', getRecruiterApplications);
router.put('/applications/:id/status', updateRecruiterApplicationStatus);

router.get('/shortlisted', getShortlistedCandidates);
router.get('/interviews', getInterviewCandidates);
router.get('/events', getRecruiterEvents);
router.get('/notifications', getRecruiterNotifications);

export default router;
