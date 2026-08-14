import { Router } from 'express';
import { getEvents, createEvent, deleteEvent } from '../controllers/eventController';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.get('/', verifyToken, getEvents);
router.post('/', verifyToken, requireRoles('faculty', 'admin'), createEvent);
router.delete('/:id', verifyToken, requireRoles('admin', 'faculty'), deleteEvent);

export default router;
