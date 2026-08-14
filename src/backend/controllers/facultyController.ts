import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Faculty } from '../models/Faculty';
import { Student } from '../models/Student';
import { User } from '../models/User';
import { Attendance } from '../models/Attendance';
import { Marks } from '../models/Marks';
import { Course } from '../models/Course';
import { Notice } from '../models/Notice';
import { Event } from '../models/Event';
import { Notification } from '../models/Notification';
import { Timetable } from '../models/Timetable';

// Helper to check if faculty is authorized for a subject
const isAuthorizedForSubject = async (userId: string, subjectName: string): Promise<boolean> => {
  const user = await User.findById(userId);
  if (user?.role === 'admin') return true; // Admins have full access

  const faculty = await Faculty.findOne({ userId });
  if (!faculty) return false;

  // Check assigned subjects array or department match
  if (faculty.assignedSubjects && faculty.assignedSubjects.includes(subjectName)) {
    return true;
  }

  // Check if course belongs to faculty's department
  const course = await Course.findOne({ name: subjectName });
  if (course && course.department === faculty.department) {
    return true;
  }

  return false;
};

// 1. GET FACULTY DASHBOARD
export const getFacultyDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    let faculty = await Faculty.findOne({ userId });
    const facultyUser = await User.findById(userId);

    if (!faculty && facultyUser?.role === 'admin') {
      // Create or mock admin-faculty context
      faculty = await Faculty.findOne();
    }

    const department = faculty?.department || 'Computer Science & Engineering';
    const assignedSubjects = faculty?.assignedSubjects || [
      'Data Structures & Algorithms',
      'Full-Stack Web Development',
      'Artificial Intelligence & ML',
    ];

    // Fetch assigned courses
    const courses = await Course.find({
      $or: [
        { name: { $in: assignedSubjects } },
        { department: department },
        { facultyUserId: userId },
      ],
    });

    // Fetch students belonging to faculty's department
    const students = await Student.find({ department })
      .populate('userId', 'name email phone profileImage')
      .sort({ rollNumber: 1 });

    // Fetch timetable for faculty
    let timetable = await Timetable.find({
      $or: [{ facultyUserId: userId }, { department }],
    });

    // Seed default timetable if none exists
    if (timetable.length === 0 && userId) {
      const defaultSlots = [
        { day: 'Monday', time: '09:30 AM - 10:30 AM', subject: 'Data Structures & Algorithms', room: 'Lab 301', section: 'CSE-A', department },
        { day: 'Monday', time: '11:30 AM - 12:30 PM', subject: 'Full-Stack Web Development', room: 'Lab 302', section: 'CSE-A', department },
        { day: 'Tuesday', time: '10:30 AM - 11:30 AM', subject: 'Artificial Intelligence & ML', room: 'Hall B-201', section: 'CSE-B', department },
        { day: 'Wednesday', time: '02:00 PM - 03:00 PM', subject: 'Data Structures & Algorithms', room: 'Lab 301', section: 'CSE-A', department },
        { day: 'Thursday', time: '09:30 AM - 10:30 AM', subject: 'Full-Stack Web Development', room: 'Lab 302', section: 'CSE-A', department },
        { day: 'Friday', time: '11:30 AM - 12:30 PM', subject: 'Database Management Systems', room: 'Hall A-102', section: 'CSE-B', department },
      ];

      timetable = await Timetable.insertMany(
        defaultSlots.map((s) => ({ ...s, facultyUserId: new mongoose.Types.ObjectId(userId) }))
      ) as any;
    }

    // Determine today's day name (e.g. "Monday")
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];
    const todaysClasses = timetable.filter((t) => t.day === todayName || t.day === 'Monday');

    // Pending tasks (subjects needing attendance today)
    const todayStr = new Date().toISOString().split('T')[0];
    const markedTodaySubjects = await Attendance.distinct('subject', { date: todayStr });
    const pendingSubjects = assignedSubjects.filter((s) => !markedTodaySubjects.includes(s));

    // Notices & Events
    const notices = await Notice.find({ audience: { $in: ['All', 'Faculty'] } }).sort({ createdAt: -1 }).limit(10);
    const events = await Event.find().sort({ date: 1 }).limit(10);
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      data: {
        profile: {
          _id: faculty?._id,
          name: facultyUser?.name || 'Dr. Faculty Member',
          email: facultyUser?.email,
          employeeId: faculty?.employeeId || 'EMP0102',
          department,
          designation: faculty?.designation || 'Associate Professor',
          phone: facultyUser?.phone || '+91 94401 23456',
          assignedSubjects,
        },
        statistics: {
          assignedSubjectsCount: assignedSubjects.length,
          totalStudentsCount: students.length,
          todaysClassesCount: todaysClasses.length,
          pendingTasksCount: pendingSubjects.length,
        },
        courses,
        students,
        timetable,
        notices,
        events,
        notifications,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching faculty dashboard data.' });
  }
};

// 2. GET FACULTY PROFILE & UPDATE
export const getFacultyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const faculty = await Faculty.findOne({ userId });
    const user = await User.findById(userId);

    res.json({
      success: true,
      data: {
        name: user?.name,
        email: user?.email,
        employeeId: faculty?.employeeId || 'EMP0102',
        department: faculty?.department || 'Computer Science & Engineering',
        designation: faculty?.designation || 'Associate Professor',
        phone: user?.phone || '',
        assignedSubjects: faculty?.assignedSubjects || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching profile.' });
  }
};

export const updateFacultyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { phone } = req.body;

    if (phone !== undefined) {
      await User.findByIdAndUpdate(userId, { phone });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating profile.' });
  }
};

// 3. GET FACULTY ASSIGNED SUBJECTS
export const getFacultySubjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const faculty = await Faculty.findOne({ userId });
    const department = faculty?.department || 'Computer Science & Engineering';
    const assignedSubjects = faculty?.assignedSubjects || [];

    const courses = await Course.find({
      $or: [
        { name: { $in: assignedSubjects } },
        { department },
        { facultyUserId: userId },
      ],
    });

    // Add student counts
    const subjectsWithCount = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await Student.countDocuments({
          department: course.department,
          semester: course.semester,
        });
        return {
          _id: course._id,
          code: course.code,
          name: course.name,
          department: course.department,
          semester: course.semester,
          credits: course.credits,
          section: 'CSE-A',
          studentCount: studentCount || 45,
        };
      })
    );

    res.json({
      success: true,
      data: subjectsWithCount,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching subjects.' });
  }
};

// 4. GET FACULTY STUDENTS (RESTRICTED TO FACULTY DEPARTMENT / SUBJECTS)
export const getFacultyStudents = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const faculty = await Faculty.findOne({ userId });
    const department = faculty?.department || 'Computer Science & Engineering';

    const { search, semester, subject } = req.query;

    const query: any = { department };

    if (semester) {
      query.semester = Number(semester);
    }

    let students = await Student.find(query)
      .populate('userId', 'name email phone profileImage')
      .sort({ rollNumber: 1 });

    if (search) {
      const searchStr = (search as string).toLowerCase();
      students = students.filter((s) => {
        const userObj = s.userId as any;
        const name = userObj?.name?.toLowerCase() || '';
        const roll = s.rollNumber?.toLowerCase() || '';
        return name.includes(searchStr) || roll.includes(searchStr);
      });
    }

    res.json({
      success: true,
      data: students.map((s) => {
        const u = s.userId as any;
        return {
          _id: s._id,
          studentUserId: u?._id || s.userId,
          name: u?.name || 'Student',
          rollNumber: s.rollNumber,
          email: u?.email || '',
          phone: u?.phone || '',
          department: s.department,
          semester: s.semester,
          section: 'CSE-A',
          attendancePercentage: s.attendancePercentage,
          cgpa: s.cgpa,
          status: s.attendancePercentage >= 75 ? 'Regular' : 'Low Attendance',
        };
      }),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching students.' });
  }
};

// 5. GET & SUBMIT ATTENDANCE
export const getFacultyAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { subject, date, section } = req.query;

    if (!subject || !date) {
      res.status(400).json({ success: false, message: 'Subject and date parameters are required.' });
      return;
    }

    const subjectStr = subject as string;
    const dateStr = date as string;

    // Check ownership / authorization
    const authorized = await isAuthorizedForSubject(userId!, subjectStr);
    if (!authorized) {
      res.status(403).json({
        success: false,
        message: `Forbidden: You are not authorized to manage attendance for subject "${subjectStr}".`,
      });
      return;
    }

    // Get course details
    const course = await Course.findOne({ name: subjectStr });
    const department = course?.department || 'Computer Science & Engineering';

    // Fetch students in department/course
    const students = await Student.find({ department })
      .populate('userId', 'name email phone')
      .sort({ rollNumber: 1 });

    // Fetch existing attendance records for this date & subject
    const existingAttendance = await Attendance.find({ subject: subjectStr, date: dateStr });

    const attendanceMap = new Map<string, string>();
    existingAttendance.forEach((rec) => {
      attendanceMap.set(rec.studentUserId.toString(), rec.status);
    });

    const studentRecords = students.map((s) => {
      const u = s.userId as any;
      const uid = u?._id?.toString() || s.userId.toString();
      const status = attendanceMap.get(uid) || 'Present'; // Default to Present if not marked yet

      return {
        studentUserId: uid,
        name: u?.name || 'Student',
        rollNumber: s.rollNumber,
        department: s.department,
        semester: s.semester,
        section: section || 'CSE-A',
        status,
        isMarked: attendanceMap.has(uid),
      };
    });

    const presentCount = studentRecords.filter((r) => r.status === 'Present').length;
    const absentCount = studentRecords.filter((r) => r.status === 'Absent').length;
    const totalCount = studentRecords.length;
    const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

    res.json({
      success: true,
      data: {
        subject: subjectStr,
        date: dateStr,
        section: section || 'CSE-A',
        isAlreadyMarked: existingAttendance.length > 0,
        presentCount,
        absentCount,
        totalCount,
        attendancePercentage,
        students: studentRecords,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching attendance records.' });
  }
};

export const submitAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, date, section, attendanceList } = req.body;
    const facultyUserId = req.user?.id;

    if (!subject || !date || !Array.isArray(attendanceList) || attendanceList.length === 0) {
      res.status(400).json({ success: false, message: 'Subject, date, and attendance list are required.' });
      return;
    }

    // Security Check: Data ownership
    const authorized = await isAuthorizedForSubject(facultyUserId!, subject);
    if (!authorized) {
      res.status(403).json({
        success: false,
        message: `Forbidden: You are not authorized to mark attendance for subject "${subject}".`,
      });
      return;
    }

    const savedRecords = [];
    for (const record of attendanceList) {
      const updated = await Attendance.findOneAndUpdate(
        { studentUserId: record.studentUserId, subject, date },
        {
          studentUserId: record.studentUserId,
          subject,
          date,
          status: record.status,
          markedBy: facultyUserId,
        },
        { upsert: true, new: true }
      );
      savedRecords.push(updated);

      // Recalculate student overall attendance percentage across all subjects
      const total = await Attendance.countDocuments({ studentUserId: record.studentUserId });
      const present = await Attendance.countDocuments({ studentUserId: record.studentUserId, status: 'Present' });
      const newPercentage = total > 0 ? Math.round((present / total) * 100) : 100;

      await Student.findOneAndUpdate({ userId: record.studentUserId }, { attendancePercentage: newPercentage });

      // Send warning alert if attendance falls below 75%
      if (newPercentage < 75) {
        await Notification.create({
          userId: record.studentUserId,
          title: '⚠️ Attendance Warning Alert',
          message: `Your overall attendance has dropped to ${newPercentage}%. Minimum required is 75%. Please contact your faculty.`,
          type: 'Attendance',
        });
      }
    }

    // Send confirmation notification to faculty
    await Notification.create({
      userId: facultyUserId,
      title: 'Class Attendance Recorded',
      message: `Attendance for ${subject} on ${date} (${section || 'CSE-A'}) has been saved in MongoDB.`,
      type: 'Attendance',
    });

    res.json({
      success: true,
      message: `Successfully recorded attendance for ${savedRecords.length} students on ${date}.`,
      records: savedRecords,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to submit attendance.' });
  }
};

// 6. GET & SUBMIT MARKS
export const getFacultyMarks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { subject, examType, section } = req.query;

    if (!subject || !examType) {
      res.status(400).json({ success: false, message: 'Subject and examType parameters are required.' });
      return;
    }

    const subjectStr = subject as string;
    const examTypeStr = examType as string;

    // Security Check: Data ownership
    const authorized = await isAuthorizedForSubject(userId!, subjectStr);
    if (!authorized) {
      res.status(403).json({
        success: false,
        message: `Forbidden: You are not authorized to enter marks for subject "${subjectStr}".`,
      });
      return;
    }

    // Get course & students
    const course = await Course.findOne({ name: subjectStr });
    const department = course?.department || 'Computer Science & Engineering';

    const students = await Student.find({ department })
      .populate('userId', 'name email phone')
      .sort({ rollNumber: 1 });

    // Fetch existing marks
    const existingMarks = await Marks.find({ subject: subjectStr, examType: examTypeStr as any });

    const marksMap = new Map<string, { marksObtained: number; maxMarks: number }>();
    existingMarks.forEach((m) => {
      marksMap.set(m.studentUserId.toString(), {
        marksObtained: m.marksObtained,
        maxMarks: m.maxMarks,
      });
    });

    const maxMarksAllowed = examTypeStr === 'Mid1' || examTypeStr === 'Mid2' ? 30 : examTypeStr === 'Internal' ? 40 : 100;

    const studentRecords = students.map((s) => {
      const u = s.userId as any;
      const uid = u?._id?.toString() || s.userId.toString();
      const existing = marksMap.get(uid);

      return {
        studentUserId: uid,
        name: u?.name || 'Student',
        rollNumber: s.rollNumber,
        department: s.department,
        semester: s.semester,
        section: section || 'CSE-A',
        marksObtained: existing ? existing.marksObtained : 0,
        maxMarks: existing ? existing.maxMarks : maxMarksAllowed,
        isEntered: Boolean(existing),
      };
    });

    res.json({
      success: true,
      data: {
        subject: subjectStr,
        examType: examTypeStr,
        section: section || 'CSE-A',
        maxMarks: maxMarksAllowed,
        students: studentRecords,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching marks.' });
  }
};

export const submitMarks = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, examType, maxMarks, marksList } = req.body;
    const facultyUserId = req.user?.id;

    if (!subject || !examType || !Array.isArray(marksList) || marksList.length === 0) {
      res.status(400).json({ success: false, message: 'Subject, examType, maxMarks, and marksList are required.' });
      return;
    }

    // Security Check: Data ownership
    const authorized = await isAuthorizedForSubject(facultyUserId!, subject);
    if (!authorized) {
      res.status(403).json({
        success: false,
        message: `Forbidden: You are not authorized to update marks for subject "${subject}".`,
      });
      return;
    }

    const savedMarks = [];
    for (const item of marksList) {
      const obtained = Number(item.marksObtained);
      const maximum = Number(maxMarks) || 30;

      if (obtained > maximum || obtained < 0) {
        res.status(400).json({
          success: false,
          message: `Validation Error: Marks obtained (${obtained}) cannot exceed max marks (${maximum}) or be negative.`,
        });
        return;
      }

      const markRecord = await Marks.findOneAndUpdate(
        { studentUserId: item.studentUserId, subject, examType },
        {
          studentUserId: item.studentUserId,
          subject,
          examType,
          marksObtained: obtained,
          maxMarks: maximum,
          facultyUserId,
        },
        { upsert: true, new: true }
      );

      savedMarks.push(markRecord);

      // Send update notification to student
      await Notification.create({
        userId: item.studentUserId,
        title: 'Exam Marks Updated',
        message: `Your marks for ${subject} (${examType}) have been updated: ${obtained}/${maximum}.`,
        type: 'Exam',
      });
    }

    res.json({
      success: true,
      message: `Successfully updated marks for ${savedMarks.length} students in ${subject} (${examType}).`,
      records: savedMarks,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to submit marks.' });
  }
};

// 7. GET FACULTY TIMETABLE
export const getFacultyTimetable = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const faculty = await Faculty.findOne({ userId });
    const department = faculty?.department || 'Computer Science & Engineering';

    const timetable = await Timetable.find({
      $or: [{ facultyUserId: userId }, { department }],
    }).sort({ day: 1 });

    res.json({
      success: true,
      data: timetable,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching timetable.' });
  }
};

// 8. NOTICES
export const getFacultyNotices = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const notices = await Notice.find({
      $or: [{ audience: { $in: ['All', 'Faculty'] } }, { createdBy: userId }],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notices,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching notices.' });
  }
};

export const createFacultyNotice = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, description, category, audience, expiryDate } = req.body;

    if (!title || !description) {
      res.status(400).json({ success: false, message: 'Title and description are required.' });
      return;
    }

    const notice = await Notice.create({
      title,
      description,
      category: category || 'Academic',
      audience: audience || 'Students',
      expiryDate,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Notice created successfully.',
      data: notice,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create notice.' });
  }
};

// 9. EVENTS
export const getFacultyEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({
      success: true,
      data: events,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching events.' });
  }
};

// 10. NOTIFICATIONS
export const getFacultyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching notifications.' });
  }
};
