import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Training } from '../models/Training';
import { User } from '../models/User';
import { Notification } from '../models/Notification';

export const getAllTrainings = async (_req: AuthRequest, res: Response) => {
  try {
    const trainings = await Training.find()
      .populate('trainerUserId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, trainings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTrainingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const training = await Training.findById(id)
      .populate('trainerUserId', 'name email phone')
      .populate('enrolledStudents', 'name email phone');

    if (!training) {
      res.status(404).json({ success: false, message: 'Training program not found.' });
      return;
    }

    res.json({ success: true, training });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTraining = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, duration, startDate, venue, maxSeats, skills, eligibility, resources, trainer, trainerUserId } = req.body;
    const creatorUserId = req.user?.id;

    if (!title || !description || !duration) {
      res.status(400).json({ success: false, message: 'Title, description, and duration are required.' });
      return;
    }

    // Determine assigned trainer user or name
    let assignedTrainerUser = trainerUserId || creatorUserId;
    let assignedTrainerName = trainer || 'Industry Expert Specialist';

    if (trainerUserId) {
      const trainerUserDoc = await User.findById(trainerUserId);
      if (trainerUserDoc) {
        assignedTrainerName = trainerUserDoc.name;
      }
    }

    const training = await Training.create({
      trainerUserId: assignedTrainerUser,
      trainerName: assignedTrainerName,
      title,
      description,
      category: category || 'Skill Bootcamp',
      duration,
      startDate: startDate || new Date().toISOString().split('T')[0],
      venue: venue || 'Computer Lab 3',
      maxSeats: maxSeats || 60,
      skills: skills || ['React', 'TypeScript', 'Node.js'],
      eligibility: eligibility || 'All Students',
      resources: resources || [],
      modules: [
        { title: 'Module 1: Orientation & Core Fundamentals', completed: false },
        { title: 'Module 2: Advanced Practical Projects', completed: false },
        { title: 'Module 3: Industry Certification & Review', completed: false },
      ],
      enrolledStudents: [],
      participantProgress: [],
    });

    // Send notifications to all students about new training program
    const studentUsers = await User.find({ role: 'student' });
    const notifications = studentUsers.map((stu) => ({
      userId: stu._id,
      title: 'New Skill Training Program Published',
      message: `'${training.title}' is now open for enrollment! Duration: ${training.duration}.`,
      type: 'Training',
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, message: 'Training program created successfully.', training });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const registerForTraining = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const studentUserId = req.user?.id;

    if (!studentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const training = await Training.findById(id);
    if (!training) {
      res.status(404).json({ success: false, message: 'Training program not found.' });
      return;
    }

    if (training.enrolledStudents.includes(studentUserId as any)) {
      res.status(400).json({ success: false, message: 'You are already registered for this training program.' });
      return;
    }

    training.enrolledStudents.push(studentUserId as any);

    // Initialize progress record for student
    const existingProgress = training.participantProgress.find(
      (p) => String(p.studentUserId) === String(studentUserId)
    );

    if (!existingProgress) {
      training.participantProgress.push({
        studentUserId: studentUserId as any,
        progressPercentage: 10, // Initial enrollment progress
        attendanceCount: 1,
        totalSessions: 10,
        status: 'Enrolled',
        grade: 'A',
        notes: 'Enrolled via BVCITS Student Portal',
        updatedAt: new Date(),
      } as any);
    }

    await training.save();

    await Notification.create({
      userId: studentUserId,
      title: 'Training Program Enrollment Confirmed',
      message: `You have successfully enrolled in '${training.title}'. Duration: ${training.duration}.`,
      type: 'Training',
    });

    res.json({ success: true, message: 'Enrolled in training program successfully!', training });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

