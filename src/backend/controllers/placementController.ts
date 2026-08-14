import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Placement } from '../models/Placement';
import { Application } from '../models/Application';
import { Student } from '../models/Student';
import { Notification } from '../models/Notification';

export const getAllPlacements = async (_req: AuthRequest, res: Response) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });
    res.json({ success: true, placements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching placements.' });
  }
};

export const createPlacement = async (req: AuthRequest, res: Response) => {
  try {
    const { companyName, companyLogo, jobRole, package: pkg, location, eligibilityCGPA, departmentEligibility, deadline, description, requirements } = req.body;
    const recruiterUserId = req.user?.id;

    if (!companyName || !jobRole || !pkg || !location || !deadline || !description) {
      res.status(400).json({ success: false, message: 'Missing required placement drive details.' });
      return;
    }

    const placement = await Placement.create({
      recruiterUserId,
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

    // Notify all eligible students about the new drive
    const students = await Student.find({ cgpa: { $gte: eligibilityCGPA || 6.0 } });
    for (const student of students) {
      await Notification.create({
        userId: student.userId,
        title: `⚡ New Placement Drive: ${companyName}`,
        message: `${companyName} is hiring for ${jobRole} offering ${pkg}. Application deadline: ${deadline}.`,
        type: 'Placement',
      });
    }

    res.status(201).json({ success: true, message: 'Placement drive posted successfully.', placement });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to post placement drive.' });
  }
};

export const applyToPlacement = async (req: AuthRequest, res: Response) => {
  try {
    const { placementId } = req.params;
    const studentUserId = req.user?.id;

    if (!studentUserId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const placement = await Placement.findById(placementId);
    if (!placement) {
      res.status(404).json({ success: false, message: 'Placement drive not found.' });
      return;
    }

    const student = await Student.findOne({ userId: studentUserId });
    if (!student) {
      res.status(400).json({ success: false, message: 'Student profile required to apply.' });
      return;
    }

    if (student.cgpa < placement.eligibilityCGPA) {
      res.status(400).json({
        success: false,
        message: `Your CGPA (${student.cgpa}) does not meet the minimum eligibility criteria (${placement.eligibilityCGPA}) for this role.`,
      });
      return;
    }

    const existingApp = await Application.findOne({ placementId, studentUserId });
    if (existingApp) {
      res.status(400).json({ success: false, message: 'You have already applied for this placement drive.' });
      return;
    }

    const application = await Application.create({
      placementId,
      studentUserId,
      status: 'Applied',
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully!', application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to submit job application.' });
  }
};

export const getRecruiterApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    let query = {};

    if (req.user?.role !== 'admin') {
      const recruiterPlacements = await Placement.find({ recruiterUserId: userId });
      const placementIds = recruiterPlacements.map((p) => p._id);
      query = { placementId: { $in: placementIds } };
    }

    const applications = await Application.find(query)
      .populate('placementId')
      .populate('studentUserId', 'name email phone')
      .sort({ createdAt: -1 });

    const placements = await Placement.find().sort({ createdAt: -1 });

    res.json({ success: true, applications, placements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching applications.' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status value.' });
      return;
    }

    const application = await Application.findByIdAndUpdate(id, { status, notes: notes || '' }, { new: true })
      .populate('placementId')
      .populate('studentUserId', 'name email');

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    // Send notification to student
    const company = (application.placementId as any)?.companyName || 'Company';
    await Notification.create({
      userId: application.studentUserId,
      title: `Placement Application Status Update`,
      message: `Your application status for ${company} has been updated to: ${status}.`,
      type: 'Application',
    });

    res.json({ success: true, message: 'Application status updated successfully.', application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update application status.' });
  }
};
