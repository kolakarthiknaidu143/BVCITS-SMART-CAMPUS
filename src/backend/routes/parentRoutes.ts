import { Router } from 'express';
import {
  getParentDashboard,
  getParentProfile,
  updateParentProfile,
  getParentStudent,
  getParentAttendance,
  getParentMarks,
  getParentTimetable,
  getParentPlacements,
  getParentTraining,
  getParentNotices,
  getParentEvents,
  getParentNotifications,
  getParentStudentInfo,
} from '../controllers/parentController';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

// Secure parent endpoints protected by RBAC
router.get('/dashboard', verifyToken, requireRoles('parent', 'admin'), getParentDashboard);
router.get('/profile', verifyToken, requireRoles('parent', 'admin'), getParentProfile);
router.put('/profile', verifyToken, requireRoles('parent', 'admin'), updateParentProfile);
router.get('/student', verifyToken, requireRoles('parent', 'admin'), getParentStudent);
router.get('/attendance', verifyToken, requireRoles('parent', 'admin'), getParentAttendance);
router.get('/marks', verifyToken, requireRoles('parent', 'admin'), getParentMarks);
router.get('/timetable', verifyToken, requireRoles('parent', 'admin'), getParentTimetable);
router.get('/placements', verifyToken, requireRoles('parent', 'admin'), getParentPlacements);
router.get('/training', verifyToken, requireRoles('parent', 'admin'), getParentTraining);
router.get('/notices', verifyToken, requireRoles('parent', 'admin'), getParentNotices);
router.get('/events', verifyToken, requireRoles('parent', 'admin'), getParentEvents);
router.get('/notifications', verifyToken, requireRoles('parent', 'admin'), getParentNotifications);

// Legacy backward compatibility
router.get('/student-info', verifyToken, requireRoles('parent', 'admin'), getParentStudentInfo);

export default router;
