import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Notice } from '../models/Notice';
import { Notification } from '../models/Notification';
import { User } from '../models/User';

export const getNotices = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role || 'student';
    let query = {};

    if (userRole !== 'admin') {
      query = { audience: { $in: ['All', userRole.charAt(0).toUpperCase() + userRole.slice(1) + 's', userRole] } };
    }

    const notices = await Notice.find(query).populate('createdBy', 'name email role').sort({ createdAt: -1 });
    res.json({ success: true, notices });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNotice = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, audience, expiryDate } = req.body;
    const createdBy = req.user?.id;

    if (!title || !description) {
      res.status(400).json({ success: false, message: 'Title and description are required.' });
      return;
    }

    const notice = await Notice.create({
      title,
      description,
      category: category || 'General',
      audience: audience || 'All',
      expiryDate,
      createdBy,
    });

    // Notify targeted users
    const usersToNotify = await User.find(
      audience === 'All' ? {} : { role: audience.toLowerCase().replace(/s$/, '') }
    );

    for (const user of usersToNotify.slice(0, 50)) {
      await Notification.create({
        userId: user._id,
        title: `📌 New Campus Notice: ${title}`,
        message: description.slice(0, 120) + '...',
        type: 'Notice',
      });
    }

    res.status(201).json({ success: true, message: 'Notice published successfully.', notice });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    res.json({ success: true, message: 'Notice removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
