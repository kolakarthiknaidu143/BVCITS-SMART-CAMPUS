import { Router } from 'express';
import {
  getTrainerProfile,
  updateTrainerProfile,
  getTrainerStats,
  getTrainerTrainings,
  updateTrainingProgram,
  getTrainingParticipants,
  updateParticipantProgress,
  addTrainingResource,
  getTrainerNotifications,
} from '../controllers/trainerController';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

// Protect all trainer routes
router.use(verifyToken);
router.use(requireRoles('trainer', 'admin'));

router.get('/profile', getTrainerProfile);
router.put('/profile', updateTrainerProfile);
router.get('/stats', getTrainerStats);
router.get('/trainings', getTrainerTrainings);
router.put('/trainings/:id', updateTrainingProgram);
router.get('/trainings/:id/participants', getTrainingParticipants);
router.put('/trainings/:id/progress', updateParticipantProgress);
router.post('/trainings/:id/resources', addTrainingResource);
router.get('/notifications', getTrainerNotifications);

export default router;
