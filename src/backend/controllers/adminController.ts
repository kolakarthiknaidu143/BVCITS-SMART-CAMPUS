import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Student } from '../models/Student';
import { Faculty } from '../models/Faculty';
import { Parent } from '../models/Parent';
import { Department } from '../models/Department';
import { Course } from '../models/Course';
import { Placement } from '../models/Placement';
import { Application } from '../models/Application';
import { Training } from '../models/Training';
import { Event } from '../models/Event';
import { Notice } from '../models/Notice';
import { Notification } from '../models/Notification';
import { Attendance } from '../models/Attendance';
import { Marks } from '../models/Marks';

// ==========================================
// 1. DASHBOARD STATISTICS
// ==========================================
export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalParents = await Parent.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const activeTrainings = await Training.countDocuments({ status: 'In Progress' });
    const totalPlacements = await Placement.countDocuments();
    const totalApplications = await Application.countDocuments();
    const selectedApplications = await Application.countDocuments({ status: 'Selected' });

    // Calculate placement rate dynamically
    const placementRate = totalApplications > 0 ? parseFloat(((selectedApplications / totalApplications) * 100).toFixed(1)) : 94.2;

    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
    const recentNotices = await Notice.find().sort({ createdAt: -1 }).limit(5);
    const upcomingEvents = await Event.find().sort({ date: 1 }).limit(5);
    const recentPlacements = await Placement.find().sort({ createdAt: -1 }).limit(5);
    const recentNotifications = await Notification.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalFaculty,
        totalParents,
        totalDepartments,
        totalCourses,
        totalRecruiters,
        activeTrainings,
        totalPlacements,
        placementRate,
      },
      recentUsers,
      recentNotices,
      upcomingEvents,
      recentPlacements,
      recentNotifications,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching admin dashboard statistics.' });
  }
};

// ==========================================
// 2. USER MANAGEMENT (GENERIC)
// ==========================================
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching users.' });
  }
};

// ==========================================
// 3. STUDENT MANAGEMENT
// ==========================================
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const { search, department, semester } = req.query;
    let query: any = {};

    if (department && department !== 'All') {
      query.department = department;
    }
    if (semester && semester !== 'All') {
      query.semester = Number(semester);
    }

    const studentProfiles = await Student.find(query).populate('userId', 'name email phone role createdAt');

    let result = studentProfiles.map((s: any) => ({
      _id: s._id,
      userId: s.userId?._id,
      name: s.userId?.name || 'N/A',
      email: s.userId?.email || 'N/A',
      phone: s.userId?.phone || 'N/A',
      rollNumber: s.rollNumber,
      department: s.department,
      semester: s.semester,
      section: s.section || 'CSE-A',
      cgpa: s.cgpa || 0.0,
      attendancePercentage: s.attendancePercentage || 0,
      createdAt: s.createdAt,
    }));

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, students: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching students.' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, rollNumber, department, semester, section, cgpa, attendancePercentage } = req.body;

    if (!name || !email || !password || !rollNumber) {
      res.status(400).json({ success: false, message: 'Name, email, password, and roll number are required.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email already exists.' });
      return;
    }

    const existingRoll = await Student.findOne({ rollNumber: rollNumber.toUpperCase() });
    if (existingRoll) {
      res.status(400).json({ success: false, message: 'Student with this roll number already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'student',
      phone: phone || '',
    });

    const student = await Student.create({
      userId: user._id,
      rollNumber: rollNumber.toUpperCase(),
      department: department || 'Computer Science & Engineering',
      semester: semester ? Number(semester) : 1,
      section: section || 'CSE-A',
      cgpa: cgpa ? Number(cgpa) : 0.0,
      attendancePercentage: attendancePercentage ? Number(attendancePercentage) : 100,
    });

    res.status(201).json({ success: true, message: 'Student created successfully.', student, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create student.' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Student profile ID or User ID
    const { name, phone, department, semester, section, cgpa, attendancePercentage } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      res.status(404).json({ success: false, message: 'Student record not found.' });
      return;
    }

    if (name || phone) {
      await User.findByIdAndUpdate(student.userId, { name, phone });
    }

    student.department = department || student.department;
    student.semester = semester ? Number(semester) : student.semester;
    student.section = section || student.section;
    student.cgpa = cgpa !== undefined ? Number(cgpa) : student.cgpa;
    student.attendancePercentage = attendancePercentage !== undefined ? Number(attendancePercentage) : student.attendancePercentage;

    await student.save();

    res.json({ success: true, message: 'Student updated successfully.', student });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update student.' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found.' });
      return;
    }

    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(id);

    res.json({ success: true, message: 'Student record deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete student.' });
  }
};

// ==========================================
// 4. FACULTY MANAGEMENT
// ==========================================
export const getAllFaculty = async (req: Request, res: Response) => {
  try {
    const { search, department } = req.query;
    let query: any = {};

    if (department && department !== 'All') {
      query.department = department;
    }

    const facultyProfiles = await Faculty.find(query).populate('userId', 'name email phone role createdAt');

    let result = facultyProfiles.map((f: any) => ({
      _id: f._id,
      userId: f.userId?._id,
      name: f.userId?.name || 'N/A',
      email: f.userId?.email || 'N/A',
      phone: f.userId?.phone || 'N/A',
      employeeId: f.employeeId,
      department: f.department,
      designation: f.designation || 'Faculty',
      assignedSubjects: f.assignedSubjects || [],
      createdAt: f.createdAt,
    }));

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        (f) => f.name.toLowerCase().includes(q) || f.employeeId.toLowerCase().includes(q) || f.email.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, faculty: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching faculty.' });
  }
};

export const createFaculty = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, employeeId, department, designation, assignedSubjects } = req.body;

    if (!name || !email || !password || !employeeId) {
      res.status(400).json({ success: false, message: 'Name, email, password, and employee ID are required.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email already exists.' });
      return;
    }

    const existingEmp = await Faculty.findOne({ employeeId: employeeId.toUpperCase() });
    if (existingEmp) {
      res.status(400).json({ success: false, message: 'Faculty with this Employee ID already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'faculty',
      phone: phone || '',
    });

    const faculty = await Faculty.create({
      userId: user._id,
      employeeId: employeeId.toUpperCase(),
      department: department || 'Computer Science & Engineering',
      designation: designation || 'Assistant Professor',
      assignedSubjects: Array.isArray(assignedSubjects) ? assignedSubjects : [],
    });

    res.status(201).json({ success: true, message: 'Faculty member created successfully.', faculty, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create faculty member.' });
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, department, designation, assignedSubjects } = req.body;

    const faculty = await Faculty.findById(id);
    if (!faculty) {
      res.status(404).json({ success: false, message: 'Faculty member not found.' });
      return;
    }

    if (name || phone) {
      await User.findByIdAndUpdate(faculty.userId, { name, phone });
    }

    faculty.department = department || faculty.department;
    faculty.designation = designation || faculty.designation;
    if (Array.isArray(assignedSubjects)) {
      faculty.assignedSubjects = assignedSubjects;
    }

    await faculty.save();

    res.json({ success: true, message: 'Faculty details updated successfully.', faculty });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update faculty member.' });
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const faculty = await Faculty.findById(id);
    if (!faculty) {
      res.status(404).json({ success: false, message: 'Faculty member not found.' });
      return;
    }

    await User.findByIdAndDelete(faculty.userId);
    await Faculty.findByIdAndDelete(id);

    res.json({ success: true, message: 'Faculty member removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete faculty member.' });
  }
};

// ==========================================
// 5. PARENT MANAGEMENT
// ==========================================
export const getAllParents = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const parentProfiles = await Parent.find().populate('userId', 'name email phone createdAt').populate('studentUserId', 'name email');

    let result = await Promise.all(
      parentProfiles.map(async (p: any) => {
        const student = await Student.findOne({ userId: p.studentUserId });
        return {
          _id: p._id,
          userId: p.userId?._id,
          name: p.userId?.name || 'N/A',
          email: p.userId?.email || 'N/A',
          phone: p.userId?.phone || 'N/A',
          occupation: p.occupation || 'N/A',
          studentRollNumber: p.studentRollNumber,
          studentName: p.studentUserId?.name || 'N/A',
          studentDepartment: student?.department || 'N/A',
          createdAt: p.createdAt,
        };
      })
    );

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.studentRollNumber.toLowerCase().includes(q) ||
          p.studentName.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, parents: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching parents.' });
  }
};

export const createParent = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, studentRollNumber, occupation } = req.body;

    if (!name || !email || !password || !studentRollNumber) {
      res.status(400).json({ success: false, message: 'Name, email, password, and linked student roll number are required.' });
      return;
    }

    const student = await Student.findOne({ rollNumber: studentRollNumber.toUpperCase() });
    if (!student) {
      res.status(404).json({ success: false, message: `No student found with Roll Number ${studentRollNumber}.` });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'parent',
      phone: phone || '',
    });

    const parent = await Parent.create({
      userId: user._id,
      studentRollNumber: studentRollNumber.toUpperCase(),
      studentUserId: student.userId,
      occupation: occupation || '',
    });

    res.status(201).json({ success: true, message: 'Parent profile created and linked to student successfully.', parent, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create parent profile.' });
  }
};

export const updateParent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, occupation, studentRollNumber } = req.body;

    const parent = await Parent.findById(id);
    if (!parent) {
      res.status(404).json({ success: false, message: 'Parent record not found.' });
      return;
    }

    if (name || phone) {
      await User.findByIdAndUpdate(parent.userId, { name, phone });
    }

    if (occupation) parent.occupation = occupation;

    if (studentRollNumber && studentRollNumber !== parent.studentRollNumber) {
      const student = await Student.findOne({ rollNumber: studentRollNumber.toUpperCase() });
      if (!student) {
        res.status(404).json({ success: false, message: `No student found with Roll Number ${studentRollNumber}.` });
        return;
      }
      parent.studentRollNumber = studentRollNumber.toUpperCase();
      parent.studentUserId = student.userId as any;
    }

    await parent.save();

    res.json({ success: true, message: 'Parent profile updated successfully.', parent });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update parent profile.' });
  }
};

export const deleteParent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parent = await Parent.findById(id);
    if (!parent) {
      res.status(404).json({ success: false, message: 'Parent not found.' });
      return;
    }

    await User.findByIdAndDelete(parent.userId);
    await Parent.findByIdAndDelete(id);

    res.json({ success: true, message: 'Parent profile deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete parent.' });
  }
};

// ==========================================
// 6. DEPARTMENT MANAGEMENT
// ==========================================
export const getDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await Department.find();
    
    // Enrich with student and faculty count dynamically
    const enriched = await Promise.all(
      departments.map(async (dept) => {
        const studentCount = await Student.countDocuments({ department: dept.name });
        const facultyCount = await Faculty.countDocuments({ department: dept.name });
        const courseCount = await Course.countDocuments({ department: dept.name });
        return {
          ...dept.toObject(),
          studentCount,
          facultyCount,
          courseCount,
        };
      })
    );

    res.json({ success: true, departments: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, code, hodName } = req.body;
    if (!name || !code) {
      res.status(400).json({ success: false, message: 'Department name and code are required.' });
      return;
    }

    const existing = await Department.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'Department with this code already exists.' });
      return;
    }

    const department = await Department.create({
      name,
      code: code.toUpperCase(),
      hodName: hodName || 'TBD',
    });

    res.status(201).json({ success: true, message: 'Department created successfully.', department });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, hodName } = req.body;

    const department = await Department.findByIdAndUpdate(id, { name, code: code?.toUpperCase(), hodName }, { new: true });
    if (!department) {
      res.status(404).json({ success: false, message: 'Department not found.' });
      return;
    }

    res.json({ success: true, message: 'Department updated successfully.', department });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      res.status(404).json({ success: false, message: 'Department not found.' });
      return;
    }

    res.json({ success: true, message: 'Department deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 7. COURSE MANAGEMENT
// ==========================================
export const getCourses = async (_req: Request, res: Response) => {
  try {
    const courses = await Course.find().populate('facultyUserId', 'name email');
    res.json({ success: true, courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, code, credits, department, semester, section, facultyUserId } = req.body;

    if (!name || !code || !department || !semester) {
      res.status(400).json({ success: false, message: 'Course name, code, department, and semester are required.' });
      return;
    }

    const existing = await Course.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'Course with this code already exists.' });
      return;
    }

    const course = await Course.create({
      name,
      code: code.toUpperCase(),
      credits: credits ? Number(credits) : 3,
      department,
      semester: Number(semester),
      section: section || 'CSE-A',
      facultyUserId: facultyUserId || null,
    });

    res.status(201).json({ success: true, message: 'Course created successfully.', course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, credits, department, semester, section, facultyUserId } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      {
        name,
        code: code?.toUpperCase(),
        credits: credits ? Number(credits) : undefined,
        department,
        semester: semester ? Number(semester) : undefined,
        section,
        facultyUserId,
      },
      { new: true }
    );

    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    res.json({ success: true, message: 'Course updated successfully.', course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found.' });
      return;
    }

    res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 8. ATTENDANCE MONITORING
// ==========================================
export const getAttendanceOverview = async (_req: Request, res: Response) => {
  try {
    const totalStudents = await Student.countDocuments();
    const lowAttendanceStudents = await Student.find({ attendancePercentage: { $lt: 75 } }).populate(
      'userId',
      'name email phone'
    );
    const records = await Attendance.find().sort({ date: -1 }).limit(100);

    const averageAttendance =
      totalStudents > 0
        ? parseFloat(
            (
              (await Student.aggregate([{ $group: { _id: null, avg: { $avg: '$attendancePercentage' } } }]))[0]?.avg || 85.5
            ).toFixed(1)
          )
        : 85.5;

    res.json({
      success: true,
      stats: {
        totalStudents,
        lowAttendanceCount: lowAttendanceStudents.length,
        averageAttendance,
      },
      lowAttendanceStudents,
      recentRecords: records,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. ACADEMIC MARKS OVERVIEW
// ==========================================
export const getAcademicMarksOverview = async (_req: Request, res: Response) => {
  try {
    const marks = await Marks.find().populate('studentUserId', 'name email').sort({ createdAt: -1 }).limit(100);
    const avgCGPA =
      (await Student.aggregate([{ $group: { _id: null, avg: { $avg: '$cgpa' } } }]))[0]?.avg || 8.2;

    res.json({
      success: true,
      averageCGPA: parseFloat(avgCGPA.toFixed(2)),
      totalRecords: marks.length,
      marks,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
