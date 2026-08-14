import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Placement } from '../models/Placement';
import { Application } from '../models/Application';
import { Student } from '../models/Student';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Notification } from '../models/Notification';

export const getRecruiterStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const isRecruiter = req.user?.role === 'recruiter';

    const placementQuery = isRecruiter ? { recruiterUserId: userId } : {};
    const placements = await Placement.find(placementQuery).sort({ createdAt: -1 });
    const placementIds = placements.map((p) => p._id);

    const applications = await Application.find({ placementId: { $in: placementIds } })
      .populate('placementId')
      .populate('studentUserId', 'name email phone')
      .sort({ createdAt: -1 });

    // Helper enrichment with Student details
    const studentUserIds = applications.map((a) => (a.studentUserId as any)?._id || a.studentUserId);
    const studentProfiles = await Student.find({ userId: { $in: studentUserIds } });
    const studentProfileMap = new Map();
    studentProfiles.forEach((sp) => studentProfileMap.set(sp.userId.toString(), sp));

    const enrichedApplications = applications.map((app) => {
      const obj = app.toObject();
      const stUserId = (obj.studentUserId as any)?._id?.toString() || obj.studentUserId?.toString();
      if (stUserId && studentProfileMap.has(stUserId)) {
        const profile = studentProfileMap.get(stUserId);
        (obj as any).studentProfile = {
          rollNumber: profile.rollNumber,
          department: profile.department,
          semester: profile.semester,
          cgpa: profile.cgpa,
          attendancePercentage: profile.attendancePercentage,
          skills: profile.skills || [],
        };
      }
      return obj;
    });

    const activeJobPostings = placements.length;
    const totalApplications = enrichedApplications.length;
    const shortlistedCandidates = enrichedApplications.filter((a) => a.status === 'Shortlisted').length;
    const interviewCandidates = enrichedApplications.filter((a) => a.status === 'Interview').length;
    const selectedCandidates = enrichedApplications.filter((a) => a.status === 'Selected').length;
    const rejectedCandidates = enrichedApplications.filter((a) => a.status === 'Rejected').length;
    const appliedCandidates = enrichedApplications.filter((a) => a.status === 'Applied').length;

    const events = await Event.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        activeJobPostings,
        totalApplications,
        shortlistedCandidates,
        interviewCandidates,
        selectedCandidates,
        rejectedCandidates,
        openPositions: activeJobPostings,
      },
      recentApplications: enrichedApplications.slice(0, 10),
      activePlacements: placements,
      events,
      statusDistribution: {
        Applied: appliedCandidates,
        Shortlisted: shortlistedCandidates,
        Interview: interviewCandidates,
        Selected: selectedCandidates,
        Rejected: rejectedCandidates,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching recruiter dashboard statistics.' });
  }
};

export const getRecruiterProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'Recruiter user profile not found.' });
      return;
    }

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching recruiter profile.' });
  }
};

export const updateRecruiterProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, phone, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(profileImage !== undefined && { profileImage }),
      },
      { new: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated successfully.', user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating recruiter profile.' });
  }
};

export const getRecruiterPlacements = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const isRecruiter = req.user?.role === 'recruiter';
    const query = isRecruiter ? { recruiterUserId: userId } : {};

    const placements = await Placement.find(query).sort({ createdAt: -1 });
    res.json({ success: true, placements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching recruiter placements.' });
  }
};

export const createRecruiterPlacement = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { companyName, companyLogo, jobRole, package: pkg, location, eligibilityCGPA, departmentEligibility, deadline, description, requirements } = req.body;

    if (!companyName || !jobRole || !pkg || !location || !deadline || !description) {
      res.status(400).json({ success: false, message: 'Company name, job role, package, location, deadline, and description are required.' });
      return;
    }

    const placement = await Placement.create({
      recruiterUserId: userId,
      companyName,
      companyLogo: companyLogo || '',
      jobRole,
      package: pkg,
      location,
      eligibilityCGPA: eligibilityCGPA || 6.0,
      departmentEligibility: departmentEligibility || [],
      deadline,
      description,
      requirements: requirements || [],
    });

    // Notify eligible students
    const eligibleStudents = await Student.find({ cgpa: { $gte: eligibilityCGPA || 6.0 } });
    for (const student of eligibleStudents) {
      await Notification.create({
        userId: student.userId,
        title: `⚡ New Placement Drive: ${companyName}`,
        message: `${companyName} is hiring for ${jobRole} offering ${pkg}. Application deadline: ${deadline}.`,
        type: 'Placement',
      });
    }

    res.status(201).json({ success: true, message: 'Placement drive posted successfully.', placement });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create placement drive.' });
  }
};

export const updateRecruiterPlacement = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const existing = await Placement.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Placement drive not found.' });
      return;
    }

    // Ownership Enforcement: Recruiter A cannot modify Recruiter B's placement drive
    if (req.user?.role === 'recruiter' && existing.recruiterUserId.toString() !== userId) {
      res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to modify another recruiter\'s placement drive.' });
      return;
    }

    const updated = await Placement.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, message: 'Placement drive updated successfully.', placement: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update placement drive.' });
  }
};

export const closeRecruiterPlacement = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const existing = await Placement.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Placement drive not found.' });
      return;
    }

    // Ownership Enforcement
    if (req.user?.role === 'recruiter' && existing.recruiterUserId.toString() !== userId) {
      res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to delete another recruiter\'s placement drive.' });
      return;
    }

    await Placement.findByIdAndDelete(id);
    await Application.deleteMany({ placementId: id });

    res.json({ success: true, message: 'Placement drive closed and removed.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to close placement drive.' });
  }
};

export const getRecruiterApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const isRecruiter = req.user?.role === 'recruiter';

    const placementQuery = isRecruiter ? { recruiterUserId: userId } : {};
    const placements = await Placement.find(placementQuery).sort({ createdAt: -1 });
    const placementIds = placements.map((p) => p._id);

    const applications = await Application.find({ placementId: { $in: placementIds } })
      .populate('placementId')
      .populate('studentUserId', 'name email phone')
      .sort({ createdAt: -1 });

    const studentUserIds = applications.map((a) => (a.studentUserId as any)?._id || a.studentUserId);
    const studentProfiles = await Student.find({ userId: { $in: studentUserIds } });
    const studentProfileMap = new Map();
    studentProfiles.forEach((sp) => studentProfileMap.set(sp.userId.toString(), sp));

    const enrichedApplications = applications.map((app) => {
      const obj = app.toObject();
      const stUserId = (obj.studentUserId as any)?._id?.toString() || obj.studentUserId?.toString();
      if (stUserId && studentProfileMap.has(stUserId)) {
        const profile = studentProfileMap.get(stUserId);
        (obj as any).studentProfile = {
          rollNumber: profile.rollNumber,
          department: profile.department,
          semester: profile.semester,
          cgpa: profile.cgpa,
          attendancePercentage: profile.attendancePercentage,
          skills: profile.skills || [],
        };
      }
      return obj;
    });

    res.json({ success: true, applications: enrichedApplications, placements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching applications.' });
  }
};

export const updateRecruiterApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid application status value.' });
      return;
    }

    const application = await Application.findById(id).populate('placementId');
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    // Ownership Enforcement: verify that the application belongs to a placement owned by this recruiter
    const placementOwnerId = (application.placementId as any)?.recruiterUserId?.toString();
    if (req.user?.role === 'recruiter' && placementOwnerId !== userId) {
      res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to modify applications for another recruiter\'s drive.' });
      return;
    }

    application.status = status;
    if (notes !== undefined) {
      application.notes = notes;
    }
    await application.save();

    // Notify student
    const companyName = (application.placementId as any)?.companyName || 'Company';
    const jobRole = (application.placementId as any)?.jobRole || 'Role';
    await Notification.create({
      userId: application.studentUserId,
      title: `Placement Application Status Update`,
      message: `Your application status for ${companyName} (${jobRole}) is now updated to: ${status}.`,
      type: 'Application',
    });

    res.json({ success: true, message: 'Application status updated successfully.', application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update application status.' });
  }
};

export const getShortlistedCandidates = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const isRecruiter = req.user?.role === 'recruiter';

    const placementQuery = isRecruiter ? { recruiterUserId: userId } : {};
    const placements = await Placement.find(placementQuery);
    const placementIds = placements.map((p) => p._id);

    const applications = await Application.find({ placementId: { $in: placementIds }, status: 'Shortlisted' })
      .populate('placementId')
      .populate('studentUserId', 'name email phone')
      .sort({ updatedAt: -1 });

    const studentUserIds = applications.map((a) => (a.studentUserId as any)?._id || a.studentUserId);
    const studentProfiles = await Student.find({ userId: { $in: studentUserIds } });
    const studentProfileMap = new Map();
    studentProfiles.forEach((sp) => studentProfileMap.set(sp.userId.toString(), sp));

    const enrichedApplications = applications.map((app) => {
      const obj = app.toObject();
      const stUserId = (obj.studentUserId as any)?._id?.toString() || obj.studentUserId?.toString();
      if (stUserId && studentProfileMap.has(stUserId)) {
        const profile = studentProfileMap.get(stUserId);
        (obj as any).studentProfile = {
          rollNumber: profile.rollNumber,
          department: profile.department,
          semester: profile.semester,
          cgpa: profile.cgpa,
          attendancePercentage: profile.attendancePercentage,
          skills: profile.skills || [],
        };
      }
      return obj;
    });

    res.json({ success: true, applications: enrichedApplications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching shortlisted candidates.' });
  }
};

export const getInterviewCandidates = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const isRecruiter = req.user?.role === 'recruiter';

    const placementQuery = isRecruiter ? { recruiterUserId: userId } : {};
    const placements = await Placement.find(placementQuery);
    const placementIds = placements.map((p) => p._id);

    const applications = await Application.find({ placementId: { $in: placementIds }, status: 'Interview' })
      .populate('placementId')
      .populate('studentUserId', 'name email phone')
      .sort({ updatedAt: -1 });

    const studentUserIds = applications.map((a) => (a.studentUserId as any)?._id || a.studentUserId);
    const studentProfiles = await Student.find({ userId: { $in: studentUserIds } });
    const studentProfileMap = new Map();
    studentProfiles.forEach((sp) => studentProfileMap.set(sp.userId.toString(), sp));

    const enrichedApplications = applications.map((app) => {
      const obj = app.toObject();
      const stUserId = (obj.studentUserId as any)?._id?.toString() || obj.studentUserId?.toString();
      if (stUserId && studentProfileMap.has(stUserId)) {
        const profile = studentProfileMap.get(stUserId);
        (obj as any).studentProfile = {
          rollNumber: profile.rollNumber,
          department: profile.department,
          semester: profile.semester,
          cgpa: profile.cgpa,
          attendancePercentage: profile.attendancePercentage,
          skills: profile.skills || [],
        };
      }
      return obj;
    });

    res.json({ success: true, applications: enrichedApplications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching interview candidates.' });
  }
};

export const getRecruiterEvents = async (_req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching campus events.' });
  }
};

export const getRecruiterNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching notifications.' });
  }
};
