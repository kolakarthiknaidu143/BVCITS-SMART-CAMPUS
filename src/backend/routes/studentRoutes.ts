import { Router } from 'express';
import {
  getStudentDashboard,
  getStudentProfile,
  updateStudentProfile,
  getStudentAttendance,
  getStudentMarks,
  getStudentApplications,
} from '../controllers/studentController';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.get('/dashboard', verifyToken, requireRoles('student', 'admin'), getStudentDashboard);
router.get('/profile', verifyToken, requireRoles('student', 'admin'), getStudentProfile);
router.put('/profile', verifyToken, requireRoles('student'), updateStudentProfile);
router.get('/attendance', verifyToken, requireRoles('student', 'admin'), getStudentAttendance);
router.get('/marks', verifyToken, requireRoles('student', 'admin'), getStudentMarks);
router.get('/applications', verifyToken, requireRoles('student', 'admin'), getStudentApplications);

export default router;
