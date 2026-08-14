import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Event } from '../models/Event';
import { Notification } from '../models/Notification';
import { User } from '../models/User';

export const getEvents = async (_req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, events });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, time, venue, organizer, registrationStatus } = req.body;

    if (!title || !description || !date || !time || !venue || !organizer) {
      res.status(400).json({ success: false, message: 'All event fields are required.' });
      return;
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      organizer,
      registrationStatus: registrationStatus || 'Open',
    });

    const users = await User.find().limit(50);
    for (const u of users) {
      await Notification.create({
        userId: u._id,
        title: `🎉 Upcoming Event: ${title}`,
        message: `Event scheduled on ${date} at ${venue}. Organized by ${organizer}.`,
        type: 'Event',
      });
    }

    res.status(201).json({ success: true, message: 'Event created successfully.', event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
