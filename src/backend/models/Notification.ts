import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'Placement' | 'Notice' | 'Event' | 'Attendance' | 'Exam' | 'Application' | 'Training';
  isRead: boolean;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['Placement', 'Notice', 'Event', 'Attendance', 'Exam', 'Application', 'Training'],
      default: 'Notice',
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = (mongoose.models.Notification as mongoose.Model<INotification>) || mongoose.model<INotification>('Notification', NotificationSchema);
