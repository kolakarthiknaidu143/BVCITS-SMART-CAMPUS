import { Router } from 'express';
import { getAllTrainings, getTrainingById, createTraining, registerForTraining } from '../controllers/trainingController';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.get('/', verifyToken, getAllTrainings);
router.get('/:id', verifyToken, getTrainingById);
router.post('/', verifyToken, requireRoles('trainer', 'admin'), createTraining);
router.post('/:id/register', verifyToken, requireRoles('student'), registerForTraining);

export default router;

