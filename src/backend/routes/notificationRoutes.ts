import { Router } from 'express';
import { getUserNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/', verifyToken, getUserNotifications);
router.put('/:id/read', verifyToken, markAsRead);
router.put('/read-all', verifyToken, markAllAsRead);

export default router;
