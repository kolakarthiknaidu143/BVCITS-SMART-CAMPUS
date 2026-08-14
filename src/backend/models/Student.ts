import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  rollNumber: string;
  department: string;
  semester: number;
  section?: string;
  cgpa: number;
  attendancePercentage: number;
  parentUserId?: mongoose.Types.ObjectId;
  skills: string[];
}

const StudentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true, default: 1 },
    section: { type: String, default: 'CSE-A' },
    cgpa: { type: Number, required: true, default: 0.0 },
    attendancePercentage: { type: Number, required: true, default: 0 },
    parentUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    skills: [{ type: String }],
  },
  { timestamps: true }
);

export const Student = (mongoose.models.Student as mongoose.Model<IStudent>) || mongoose.model<IStudent>('Student', StudentSchema);
