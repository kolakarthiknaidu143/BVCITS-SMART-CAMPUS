import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Student } from '../models/Student';
import { Attendance } from '../models/Attendance';
import { Marks } from '../models/Marks';
import { Course } from '../models/Course';
import { Notice } from '../models/Notice';
import { Event } from '../models/Event';
import { Placement } from '../models/Placement';
import { Application } from '../models/Application';
import { Training } from '../models/Training';
import { User } from '../models/User';

export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const student = await Student.findOne({ userId }).populate('parentUserId', 'name email phone');
    if (!student) {
      res.status(404).json({ success: false, message: 'Student profile not found.' });
      return;
    }
    const userObj = await User.findById(userId).select('-password');
    res.json({
      success: true,
      data: {
        _id: student._id,
        userId: userObj,
        rollNumber: student.rollNumber,
        department: student.department,
        semester: student.semester,
        cgpa: student.cgpa,
        attendancePercentage: student.attendancePercentage,
        skills: student.skills,
        parent: student.parentUserId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching student profile.' });
  }
};

export const updateStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { phone, skills } = req.body;

    if (phone !== undefined) {
      await User.findByIdAndUpdate(userId, { phone });
    }

    const student = await Student.findOne({ userId });
    if (!student) {
      res.status(404).json({ success: false, message: 'Student profile not found.' });
      return;
    }

    if (skills !== undefined && Array.isArray(skills)) {
      student.skills = skills;
      await student.save();
    }

    const updatedUser = await User.findById(userId).select('-password');
    const updatedStudent = await Student.findOne({ userId }).populate('parentUserId', 'name email phone');

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        _id: updatedStudent._id,
        userId: updatedUser,
        rollNumber: updatedStudent.rollNumber,
        department: updatedStudent.department,
        semester: updatedStudent.semester,
        cgpa: updatedStudent.cgpa,
        attendancePercentage: updatedStudent.attendancePercentage,
        skills: updatedStudent.skills,
        parent: updatedStudent.parentUserId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating student profile.' });
  }
};

export const getStudentAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const attendanceRecords = await Attendance.find({ studentUserId: userId }).sort({ date: -1 });

    const subjectBreakdown: Record<string, { total: number; present: number; percentage: number }> = {};
    attendanceRecords.forEach((record) => {
      if (!subjectBreakdown[record.subject]) {
        subjectBreakdown[record.subject] = { total: 0, present: 0, percentage: 0 };
      }
      subjectBreakdown[record.subject].total += 1;
      if (record.status === 'Present') {
        subjectBreakdown[record.subject].present += 1;
      }
    });

    Object.keys(subjectBreakdown).forEach((subj) => {
      const item = subjectBreakdown[subj];
      item.percentage = item.total > 0 ? Math.round((item.present / item.total) * 100) : 0;
    });

    const totalClasses = attendanceRecords.length;
    const presentClasses = attendanceRecords.filter((a) => a.status === 'Present').length;
    const overallPercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    res.json({
      success: true,
      data: {
        records: attendanceRecords,
        overallPercentage,
        totalClasses,
        presentClasses,
        subjectBreakdown,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching student attendance.' });
  }
};

export const getStudentMarks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const marksRecords = await Marks.find({ studentUserId: userId }).sort({ createdAt: -1 });
    const student = await Student.findOne({ userId });

    res.json({
      success: true,
      data: {
        records: marksRecords,
        cgpa: student?.cgpa || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching student marks.' });
  }
};

export const getStudentApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const applications = await Application.find({ studentUserId: userId }).populate('placementId');
    res.json({
      success: true,
      data: applications,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching placement applications.' });
  }
};

export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const student = await Student.findOne({ userId }).populate('parentUserId', 'name email phone');
    const userObj = await User.findById(userId).select('-password');

    if (!student) {
      res.status(404).json({ success: false, message: 'Student profile not found.' });
      return;
    }

    const courses = await Course.find({ department: student.department, semester: student.semester });
    const attendanceRecords = await Attendance.find({ studentUserId: userId }).sort({ date: -1 });
    const marksRecords = await Marks.find({ studentUserId: userId }).sort({ createdAt: -1 });
    const notices = await Notice.find().sort({ createdAt: -1 }).limit(10);
    const events = await Event.find().sort({ date: 1 }).limit(10);
    const placementDrives = await Placement.find({ eligibilityCGPA: { $lte: student.cgpa } }).sort({ createdAt: -1 });
    const applications = await Application.find({ studentUserId: userId }).populate('placementId');
    const trainings = await Training.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        profile: {
          _id: student._id,
          userId: userObj,
          rollNumber: student.rollNumber,
          department: student.department,
          semester: student.semester,
          cgpa: student.cgpa,
          attendancePercentage: student.attendancePercentage,
          skills: student.skills,
          parent: student.parentUserId,
        },
        courses,
        attendanceRecords,
        marksRecords,
        notices,
        events,
        placementDrives,
        applications,
        trainings,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching student dashboard data.' });
  }
};

