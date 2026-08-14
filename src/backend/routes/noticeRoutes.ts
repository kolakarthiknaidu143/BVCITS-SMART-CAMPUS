import { Router } from 'express';
import { getNotices, createNotice, deleteNotice } from '../controllers/noticeController';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.get('/', verifyToken, getNotices);
router.post('/', verifyToken, requireRoles('faculty', 'admin'), createNotice);
router.delete('/:id', verifyToken, requireRoles('admin', 'faculty'), deleteNotice);

export default router;
