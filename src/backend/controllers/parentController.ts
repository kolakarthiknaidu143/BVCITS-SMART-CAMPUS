import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Parent } from '../models/Parent';
import { Student } from '../models/Student';
import { User } from '../models/User';
import { Attendance } from '../models/Attendance';
import { Marks } from '../models/Marks';
import { Course } from '../models/Course';
import { Notice } from '../models/Notice';
import { Event } from '../models/Event';
import { Placement } from '../models/Placement';
import { Application } from '../models/Application';
import { Training } from '../models/Training';
import { Notification } from '../models/Notification';
import { Timetable } from '../models/Timetable';

// Helper function to resolve the parent's linked student securely
const getLinkedStudent = async (parentUserId?: string) => {
  if (!parentUserId) return null;
  const parent = await Parent.findOne({ userId: parentUserId });
  if (!parent || !parent.studentUserId) return null;
  const studentUser = await User.findById(parent.studentUserId).select('-password');
  const studentProfile = await Student.findOne({ userId: parent.studentUserId });
  return { parent, studentUser, studentProfile };
};

// 1. GET /api/parent/dashboard
export const getParentDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const parentUserId = req.user?.id;
    const linked = await getLinkedStudent(parentUserId);

    if (!linked || !linked.studentProfile) {
      res.status(404).json({
        success: false,
        message: 'No linked student profile found for this parent account.',
      });
      return;
    }

    const { parent, studentUser, studentProfile } = linked;
    const studentId = parent.studentUserId;

    // Attendance data & statistics
    const attendanceRecords = await Attendance.find({ studentUserId: studentId }).sort({ date: -1 });
    const totalClasses = attendanceRecords.length;
    const presentClasses = attendanceRecords.filter((a) => a.status === 'Present').length;
    const absentClasses = totalClasses - presentClasses;
    const overallAttendance = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : studentProfile.attendancePercentage || 0;

    // Marks records & academic summary
    const marksRecords = await Marks.find({ studentUserId: studentId }).sort({ createdAt: -1 });

    // Placement Applications & Eligibility
    const applications = await Application.find({ studentUserId: studentId }).populate('placementId').sort({ appliedAt: -1 });
    const eligiblePlacements = await Placement.find({
      eligibilityCGPA: { $lte: studentProfile.cgpa || 0 },
      departmentEligibility: studentProfile.department,
    }).countDocuments();

    // Active Training Programs
    const trainings = await Training.find({ enrolledStudents: studentId }).sort({ createdAt: -1 });
    const studentTrainings = trainings.map((t) => {
      const progress = t.participantProgress?.find((p) => p.studentUserId.toString() === studentId.toString());
      return {
        _id: t._id,
        title: t.title,
        trainerName: t.trainerName,
        category: t.category,
        duration: t.duration,
        status: t.status,
        progressPercentage: progress?.progressPercentage || 0,
        grade: progress?.grade || 'In Progress',
        attendanceCount: progress?.attendanceCount || 0,
        totalSessions: progress?.totalSessions || 10,
        feedback: progress?.notes || '',
      };
    });

    // Notices & Events
    const notices = await Notice.find({ audience: { $in: ['All', 'Parents'] } }).sort({ createdAt: -1 }).limit(5);
    const events = await Event.find().sort({ date: 1 }).limit(5);
    const notifications = await Notification.find({ userId: parentUserId }).sort({ createdAt: -1 }).limit(5);
    const unreadNotificationsCount = await Notification.countDocuments({ userId: parentUserId, isRead: false });

    res.json({
      success: true,
      data: {
        student: {
          _id: studentProfile._id,
          userId: studentUser,
          rollNumber: studentProfile.rollNumber,
          department: studentProfile.department,
          semester: studentProfile.semester,
          cgpa: studentProfile.cgpa,
          skills: studentProfile.skills,
          attendancePercentage: overallAttendance,
        },
        attendanceSummary: {
          overallPercentage: overallAttendance,
          totalClasses,
          presentClasses,
          absentClasses,
          isLowAttendance: overallAttendance < 75,
          recentRecords: attendanceRecords.slice(0, 5),
        },
        academicSummary: {
          cgpa: studentProfile.cgpa,
          totalMarksEvaluated: marksRecords.length,
          recentMarks: marksRecords.slice(0, 5),
        },
        placementSummary: {
          eligibleDrivesCount: eligiblePlacements,
          applicationsCount: applications.length,
          shortlistedCount: applications.filter((a) => a.status === 'Shortlisted').length,
          selectedCount: applications.filter((a) => a.status === 'Selected').length,
          recentApplications: applications.slice(0, 5),
        },
        trainingSummary: {
          enrolledCount: studentTrainings.length,
          trainings: studentTrainings,
        },
        notices,
        events,
        notifications,
        unreadNotificationsCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching parent dashboard data.' });
  }
};

// 2. GET /api/parent/profile
export const getParentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const parentUserId = req.user?.id;
    const parentUser = await User.findById(parentUserId).select('-password');
    const linked = await getLinkedStudent(parentUserId);

    if (!parentUser) {
      res.status(404).json({ success: false, message: 'Parent user not found.' });
      return;
    }

    res.json({
      success: true,
      data: {
        _id: linked?.parent._id,
        userId: parentUser,
        name: parentUser.name,
        email: parentUser.email,
        phone: parentUser.phone || '',
        occupation: linked?.parent.occupation || '',
        relationship: 'Parent / Guardian',
        studentRollNumber: linked?.parent.studentRollNumber || linked?.studentProfile?.rollNumber || '',
        student: linked?.studentUser
          ? {
              name: linked.studentUser.name,
              email: linked.studentUser.email,
              phone: linked.studentUser.phone,
              rollNumber: linked.studentProfile?.rollNumber,
              department: linked.studentProfile?.department,
              semester: linked.studentProfile?.semester,
              cgpa: linked.studentProfile?.cgpa,
            }
          : null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching parent profile.' });
  }
};

// 3. PUT /api/parent/profile (Only edit phone & occupation)
export const updateParentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const parentUserId = req.user?.id;
    if (!parentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { phone, occupation } = req.body;

    if (phone !== undefined) {
      await User.findByIdAndUpdate(parentUserId, { phone: String(phone).trim() });
    }

    if (occupation !== undefined) {
      await Parent.findOneAndUpdate({ userId: parentUserId }, { occupation: String(occupation).trim() });
    }

    const updatedUser = await User.findById(parentUserId).select('-password');
    const linked = await getLinkedStudent(parentUserId);

    res.json({
      success: true,
      message: 'Parent profile updated successfully.',
      data: {
        _id: linked?.parent._id,
        userId: updatedUser,
        name: updatedUser?.name,
        email: updatedUser?.email,
        phone: updatedUser?.phone || '',
        occupation: linked?.parent.occupation || '',
        relationship: 'Parent / Guardian',
        studentRollNumber: linked?.parent.studentRollNumber || linked?.studentProfile?.rollNumber || '',
        student: linked?.studentUser
          ? {
              name: linked.studentUser.name,
              email: linked.studentUser.email,
              rollNumber: linked.studentProfile?.rollNumber,
              department: linked.studentProfile?.department,
            }
          : null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating parent profile.' });
  }
};

// 4. GET /api/parent/student
export const getParentStudent = async (req: AuthRequest, res: Response) => {
  try {
    const parentUserId = req.user?.id;
    const linked = await getLinkedStudent(parentUserId);

    if (!linked || !linked.studentProfile) {
      res.status(404).json({ success: false, message: 'No linked student found.' });
      return;
    }

    const { studentUser, studentProfile } = linked;
    const courses = await Course.find({
      department: studentProfile.department,
      semester: studentProfile.semester,
    });

    res.json({
      success: true,
      data: {
        student: {
          _id: studentProfile._id,
          userId: studentUser,
          rollNumber: studentProfile.rollNumber,
          department: studentProfile.department,
          semester: studentProfile.semester,
          cgpa: studentProfile.cgpa,
          attendancePercentage: studentProfile.attendancePercentage,
          skills: studentProfile.skills || [],
        },
        courses,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching linked student details.' });
  }
};

// 5. GET /api/parent/attendance (Read-Only)
export const getParentAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const parentUserId = req.user?.id;
    const linked = await getLinkedStudent(parentUserId);

    if (!linked || !linked.parent.studentUserId) {
      res.status(404).json({ success: false, message: 'No linked student found for attendance query.' });
      return;
    }

    const studentId = linked.parent.studentUserId;
    const attendanceRecords = await Attendance.find({ studentUserId: studentId }).sort({ date: -1 });

    const subjectBreakdown: Record<string, { total: number; present: number; absent: number; percentage: number }> = {};
    attendanceRecords.forEach((record) => {
      if (!subjectBreakdown[record.subject]) {
        subjectBreakdown[record.subject] = { total: 0, present: 0, absent: 0, percentage: 0 };
      }
      subjectBreakdown[record.subject].total += 1;
      if (record.status === 'Present') {
        subjectBreakdown[record.subject].present += 1;
      } else {
        subjectBreakdown[record.subject].absent += 1;
      }
    });

    Object.keys(subjectBreakdown).forEach((subj) => {
      const item = subjectBreakdown[subj];
      item.percentage = item.total > 0 ? Math.round((item.present / item.total) * 100) : 0;
    });

    const totalClasses = attendanceRecords.length;
    const presentClasses = attendanceRecords.filter((a) => a.status === 'Present').length;
    const absentClasses = totalClasses - presentClasses;
    const overallPercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : linked.studentProfile?.attendancePercentage || 0;

    res.json({
      success: true,
      data: {
        records: attendanceRecords,
        overallPercentage,
        totalClasses,
        presentClasses,
        absentClasses,
        threshold: 75,
        status: overallPercentage >= 75 ? 'Satisfactory' : 'Critical Low Attendance Alert',
        subjectBreakdown,
        student: {
          name: linked.studentUser?.name,
          rollNumber: linked.studentProfile?.rollNumber,
          department: linked.studentProfile?.department,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching student attendance.' });
  }
};

// 6. GET /api/parent/marks (Read-Only)
export const getParentMarks = async (req: AuthRequest, res: Response) => {
  try {
    const parentUserId = req.user?.id;
    const linked = await getLinkedStudent(parentUserId);

    if (!linked || !linked.parent.studentUserId) {
      res.status(404).json({ success: false, message: 'No linked student found for marks query.' });
      return;
    }

    const studentId = linked.parent.studentUserId;
    const marksRecords = await Marks.find({ studentUserId: studentId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        records: marksRecords,
        cgpa: linked.studentProfile?.cgpa || 0,
        student: {
          name: linked.studentUser?.name,
          rollNumber: linked.studentProfile?.rollNumber,
          department: linked.studentProfile?.department,
          semester: linked.studentProfile?.semester,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching student marks.' });
  }
};

// 7. GET /api/parent/timetable (Read-Only)
export const getParentTimetable = async (req: AuthRequest, res: Response) => {
  try {
    const parentUserId = req.user?.id;
    const linked = await getLinkedStudent(parentUserId);

    if (!linked || !linked.studentProfile) {
      res.status(404).json({ success: false, message: 'No linked student found for timetable.' });
      return;
    }

    const { studentProfile } = linked;
    const department = studentProfile.department;

    // Fetch from database Timetable collection
    const timetableRecords = await Timetable.find({ department }).populate('facultyUserId', 'name email');

    res.json({
      success: true,
      data: {
        department: studentProfile.department,
        semester: studentProfile.semester,
        records: timetableRecords,
        student: {
          name: linked.studentUser?.name,
          rollNumber: studentProfile.rollNumber,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching student timetable.' });
  }
};

// 8. GET /api/parent/placements (Read-Only)
export const getParentPlacements = async (req: AuthRequest, res: Response) => {
  try {
    const parentUserId = req.user?.id;
    const linked = await getLinkedStudent(parentUserId);

    if (!linked || !linked.studentProfile) {
      res.status(404).json({ success: false, message: 'No linked student found for placements.' });
      return;
    }

    const { studentProfile, studentUser } = linked;
    const studentId = linked.parent.studentUserId;

    // Applications submitted by the student
    const applications = await Application.find({ studentUserId: studentId }).populate('placementId').sort({ appliedAt: -1 });

    // Eligible placement drives based on department & CGPA
    const eligibleDrives = await Placement.find({
      eligibilityCGPA: { $lte: studentProfile.cgpa || 0 },
      departmentEligibility: studentProfile.department,
    }).sort({ deadline: 1 });

    res.json({
      success: true,
      data: {
        applications,
        eligibleDrives,
        student: {
          name: studentUser?.name,
          rollNumber: studentProfile.rollNumber,
          cgpa: studentProfile.cgpa,
          department: studentProfile.department,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching student placements.' });
  }
};

// 9. GET /api/parent/training (Read-Only)
export const getParentTraining = async (req: AuthRequest, res: Response) => {
  try {
    const parentUserId = req.user?.id;
    const linked = await getLinkedStudent(parentUserId);

    if (!linked || !linked.parent.studentUserId) {
      res.status(404).json({ success: false, message: 'No linked student found for training records.' });
      return;
    }

    const studentId = linked.parent.studentUserId;
    const trainings = await Training.find({ enrolledStudents: studentId }).sort({ createdAt: -1 });

    const studentTrainings = trainings.map((t) => {
      const progress = t.participantProgress?.find((p) => p.studentUserId.toString() === studentId.toString());
      return {
        _id: t._id,
        title: t.title,
        description: t.description,
        trainerName: t.trainerName,
        category: t.category,
        duration: t.duration,
        startDate: t.startDate,
        venue: t.venue,
        skills: t.skills,
        status: t.status,
        modules: t.modules || [],
        resources: t.resources || [],
        progressPercentage: progress?.progressPercentage || 0,
        attendanceCount: progress?.attendanceCount || 0,
        totalSessions: progress?.totalSessions || 10,
        grade: progress?.grade || 'In Progress',
        participantStatus: progress?.status || 'Enrolled',
        notes: progress?.notes || '',
        updatedAt: progress?.updatedAt,
      };
    });

    res.json({
      success: true,
      data: {
        trainings: studentTrainings,
        student: {
          name: linked.studentUser?.name,
          rollNumber: linked.studentProfile?.rollNumber,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching student training progress.' });
  }
};

// 10. GET /api/parent/notices (Read-Only)
export const getParentNotices = async (req: AuthRequest, res: Response) => {
  try {
    const notices = await Notice.find({ audience: { $in: ['All', 'Parents'] } }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: notices,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching parent notices.' });
  }
};

// 11. GET /api/parent/events (Read-Only)
export const getParentEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({
      success: true,
      data: events,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching campus events.' });
  }
};

// 12. GET /api/parent/notifications (Read-Only)
export const getParentNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const parentUserId = req.user?.id;
    if (!parentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const notifications = await Notification.find({ userId: parentUserId }).sort({ createdAt: -1 });
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching parent notifications.' });
  }
};

// 13. GET /api/parent/student-info (Backward compatibility)
export const getParentStudentInfo = async (req: AuthRequest, res: Response) => {
  try {
    const parentUserId = req.user?.id;
    const linked = await getLinkedStudent(parentUserId);

    if (!linked || !linked.studentProfile) {
      res.status(404).json({ success: false, message: 'No linked student profile found for this parent account.' });
      return;
    }

    const { parent, studentUser, studentProfile } = linked;
    const courses = await Course.find({ department: studentProfile.department, semester: studentProfile.semester });
    const attendanceRecords = await Attendance.find({ studentUserId: parent.studentUserId }).sort({ date: -1 });
    const marksRecords = await Marks.find({ studentUserId: parent.studentUserId }).sort({ createdAt: -1 });
    const notices = await Notice.find({ audience: { $in: ['All', 'Parents', 'Students'] } }).sort({ createdAt: -1 });
    const events = await Event.find().sort({ date: 1 });
    const applications = await Application.find({ studentUserId: parent.studentUserId }).populate('placementId');

    res.json({
      success: true,
      data: {
        student: {
          name: studentUser?.name,
          email: studentUser?.email,
          phone: studentUser?.phone,
          rollNumber: studentProfile.rollNumber,
          department: studentProfile.department,
          semester: studentProfile.semester,
          cgpa: studentProfile.cgpa,
          attendancePercentage: studentProfile.attendancePercentage,
        },
        courses,
        attendanceRecords,
        marksRecords,
        notices,
        events,
        applications,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching parent portal student info.' });
  }
};
