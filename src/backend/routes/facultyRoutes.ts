import { Router } from 'express';
import {
  getFacultyDashboard,
  getFacultyProfile,
  updateFacultyProfile,
  getFacultySubjects,
  getFacultyStudents,
  getFacultyAttendance,
  submitAttendance,
  getFacultyMarks,
  submitMarks,
  getFacultyTimetable,
  getFacultyNotices,
  createFacultyNotice,
  getFacultyEvents,
  getFacultyNotifications,
} from '../controllers/facultyController';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

// Apply authentication & role authorization (faculty and admin only) to ALL routes
router.use(verifyToken, requireRoles('faculty', 'admin'));

router.get('/dashboard', getFacultyDashboard);
router.get('/profile', getFacultyProfile);
router.put('/profile', updateFacultyProfile);
router.get('/subjects', getFacultySubjects);
router.get('/students', getFacultyStudents);

router.get('/attendance', getFacultyAttendance);
router.post('/attendance', submitAttendance);

router.get('/marks', getFacultyMarks);
router.post('/marks', submitMarks);

router.get('/timetable', getFacultyTimetable);

router.get('/notices', getFacultyNotices);
router.post('/notices', createFacultyNotice);

router.get('/events', getFacultyEvents);

router.get('/notifications', getFacultyNotifications);

export default router;
