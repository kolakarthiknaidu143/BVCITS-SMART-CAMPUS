import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Notification } from '../models/Notification';

export const getUserNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(30);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.json({ success: true, notifications, unreadCount });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    await Notification.findOneAndUpdate({ _id: id, userId }, { isRead: true });
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
