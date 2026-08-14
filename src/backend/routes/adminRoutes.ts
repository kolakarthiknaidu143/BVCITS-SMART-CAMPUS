import { Router } from 'express';
import {
  getAdminStats,
  getAllUsers,
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getAllParents,
  createParent,
  updateParent,
  deleteParent,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAttendanceOverview,
  getAcademicMarksOverview,
} from '../controllers/adminController';
import { verifyToken } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

// All admin routes require token authentication and 'admin' role
router.use(verifyToken, requireRoles('admin'));

// Dashboard Stats & Generic Users
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);

// Student Management
router.get('/students', getAllStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Faculty Management
router.get('/faculty', getAllFaculty);
router.post('/faculty', createFaculty);
router.put('/faculty/:id', updateFaculty);
router.delete('/faculty/:id', deleteFaculty);

// Parent Management
router.get('/parents', getAllParents);
router.post('/parents', createParent);
router.put('/parents/:id', updateParent);
router.delete('/parents/:id', deleteParent);

// Department Management
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

// Course Management
router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Institution Academic Monitoring
router.get('/attendance', getAttendanceOverview);
router.get('/marks', getAcademicMarksOverview);

export default router;
