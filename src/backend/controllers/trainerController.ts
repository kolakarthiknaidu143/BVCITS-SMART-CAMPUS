import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Training } from '../models/Training';
import { User } from '../models/User';
import { Student } from '../models/Student';
import { Notification } from '../models/Notification';

// 1. Get Trainer Profile
export const getTrainerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const trainerUserId = req.user?.id;
    const user = await User.findById(trainerUserId);
    if (!user) {
      res.status(404).json({ success: false, message: 'Trainer user not found.' });
      return;
    }
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Update Trainer Profile
export const updateTrainerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const trainerUserId = req.user?.id;
    const { name, phone, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      trainerUserId,
      { $set: { name, phone, profileImage } },
      { new: true }
    );

    res.json({ success: true, message: 'Trainer profile updated successfully.', user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Trainer Stats
export const getTrainerStats = async (req: AuthRequest, res: Response) => {
  try {
    const trainerUserId = req.user?.id;

    // Find trainings where trainerUserId matches or all trainings if admin/general
    const trainings = await Training.find({
      $or: [{ trainerUserId }, { trainerName: { $exists: true } }],
    });

    let totalPrograms = trainings.length;
    let totalEnrolledTrainees = 0;
    let completedPrograms = 0;
    let inProgressPrograms = 0;

    trainings.forEach((t) => {
      totalEnrolledTrainees += t.enrolledStudents.length;
      if (t.status === 'Completed') completedPrograms++;
      if (t.status === 'In Progress') inProgressPrograms++;
    });

    res.json({
      success: true,
      stats: {
        totalPrograms,
        totalEnrolledTrainees,
        completedPrograms,
        inProgressPrograms,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Get Trainer Managed Trainings
export const getTrainerTrainings = async (req: AuthRequest, res: Response) => {
  try {
    const trainerUserId = req.user?.id;
    const trainings = await Training.find({
      $or: [{ trainerUserId }, { trainerName: { $ne: '' } }],
    })
      .populate('enrolledStudents', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, trainings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Update Training Program Details / Modules
export const updateTrainingProgram = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, duration, startDate, venue, skills, status, modules, resources } = req.body;

    const training = await Training.findById(id);
    if (!training) {
      res.status(404).json({ success: false, message: 'Training program not found.' });
      return;
    }

    if (title) training.title = title;
    if (description) training.description = description;
    if (category) training.category = category;
    if (duration) training.duration = duration;
    if (startDate) training.startDate = startDate;
    if (venue) training.venue = venue;
    if (skills) training.skills = skills;
    if (status) training.status = status;
    if (modules) training.modules = modules;
    if (resources) training.resources = resources;

    await training.save();

    res.json({ success: true, message: 'Training program updated successfully.', training });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Get Participants with Progress
export const getTrainingParticipants = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const training = await Training.findById(id).populate('enrolledStudents', 'name email phone role');
    if (!training) {
      res.status(404).json({ success: false, message: 'Training program not found.' });
      return;
    }

    // Fetch Student Profiles for enrolled students
    const studentUserIds = training.enrolledStudents.map((s: any) => s._id);
    const studentProfiles = await Student.find({ userId: { $in: studentUserIds } });

    const studentProfileMap = new Map();
    studentProfiles.forEach((sp) => {
      studentProfileMap.set(String(sp.userId), sp);
    });

    // Combine user info + student profile + progress
    const participants = training.enrolledStudents.map((studentUser: any) => {
      const sId = String(studentUser._id);
      const profile = studentProfileMap.get(sId);
      const existingProgress = training.participantProgress.find(
        (p) => String(p.studentUserId) === sId
      );

      return {
        studentUserId: studentUser,
        studentProfile: profile || null,
        progressPercentage: existingProgress ? existingProgress.progressPercentage : 0,
        attendanceCount: existingProgress ? existingProgress.attendanceCount : 0,
        totalSessions: existingProgress ? existingProgress.totalSessions : 10,
        status: existingProgress ? existingProgress.status : 'Enrolled',
        grade: existingProgress ? existingProgress.grade : 'A',
        notes: existingProgress ? existingProgress.notes : '',
        updatedAt: existingProgress ? existingProgress.updatedAt : new Date(),
      };
    });

    res.json({
      success: true,
      trainingTitle: training.title,
      participants,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Update Student Progress & Notify
export const updateParticipantProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Training ID
    const { studentUserId, progressPercentage, attendanceCount, totalSessions, status, grade, notes } = req.body;

    if (!studentUserId) {
      res.status(400).json({ success: false, message: 'Student User ID is required.' });
      return;
    }

    const training = await Training.findById(id);
    if (!training) {
      res.status(404).json({ success: false, message: 'Training program not found.' });
      return;
    }

    let progressItem = training.participantProgress.find(
      (p) => String(p.studentUserId) === String(studentUserId)
    );

    if (progressItem) {
      if (progressPercentage !== undefined) progressItem.progressPercentage = Number(progressPercentage);
      if (attendanceCount !== undefined) progressItem.attendanceCount = Number(attendanceCount);
      if (totalSessions !== undefined) progressItem.totalSessions = Number(totalSessions);
      if (status) progressItem.status = status;
      if (grade) progressItem.grade = grade;
      if (notes !== undefined) progressItem.notes = notes;
      progressItem.updatedAt = new Date();
    } else {
      training.participantProgress.push({
        studentUserId,
        progressPercentage: Number(progressPercentage) || 0,
        attendanceCount: Number(attendanceCount) || 0,
        totalSessions: Number(totalSessions) || 10,
        status: status || 'In Progress',
        grade: grade || 'A',
        notes: notes || '',
        updatedAt: new Date(),
      } as any);
    }

    await training.save();

    // Create Notification for Student in MongoDB Atlas
    await Notification.create({
      userId: studentUserId,
      title: 'Training Progress Updated',
      message: `Your trainer updated your progress in '${training.title}' to ${progressPercentage ?? 0}% (${status || 'In Progress'}).`,
      type: 'Training',
    });

    res.json({
      success: true,
      message: 'Participant progress updated successfully.',
      training,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Add Resource to Training
export const addTrainingResource = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { resourceUrl } = req.body;

    if (!resourceUrl) {
      res.status(400).json({ success: false, message: 'Resource URL is required.' });
      return;
    }

    const training = await Training.findById(id);
    if (!training) {
      res.status(404).json({ success: false, message: 'Training program not found.' });
      return;
    }

    training.resources.push(resourceUrl);
    await training.save();

    res.json({ success: true, message: 'Resource added to training program.', training });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Get Trainer Notifications
export const getTrainerNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const trainerUserId = req.user?.id;
    const notifications = await Notification.find({ userId: trainerUserId }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
