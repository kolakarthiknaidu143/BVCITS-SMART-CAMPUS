import mongoose, { Schema, Document } from 'mongoose';

export interface ITimetable extends Document {
  facultyUserId: mongoose.Types.ObjectId;
  day: string;
  time: string;
  subject: string;
  room: string;
  section: string;
  department: string;
}

const TimetableSchema: Schema = new Schema(
  {
    facultyUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    day: { type: String, required: true }, // e.g. 'Monday', 'Tuesday'
    time: { type: String, required: true }, // e.g. '09:30 AM - 10:30 AM'
    subject: { type: String, required: true },
    room: { type: String, required: true },
    section: { type: String, required: true, default: 'CSE-A' },
    department: { type: String, required: true },
  },
  { timestamps: true }
);

export const Timetable = (mongoose.models.Timetable as mongoose.Model<ITimetable>) || mongoose.model<ITimetable>('Timetable', TimetableSchema);
