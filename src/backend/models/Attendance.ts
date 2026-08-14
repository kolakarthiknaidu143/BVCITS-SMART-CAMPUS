import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentUserId: mongoose.Types.ObjectId;
  subject: string;
  date: string;
  status: 'Present' | 'Absent';
  markedBy: mongoose.Types.ObjectId;
}

const AttendanceSchema: Schema = new Schema(
  {
    studentUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    status: { type: String, enum: ['Present', 'Absent'], required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

AttendanceSchema.index({ studentUserId: 1, subject: 1, date: 1 }, { unique: true });

export const Attendance = (mongoose.models.Attendance as mongoose.Model<IAttendance>) || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
