import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  code: string;
  name: string;
  department: string;
  semester: number;
  section?: string;
  credits: number;
  facultyUserId?: mongoose.Types.ObjectId;
}

const CourseSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    section: { type: String, default: 'CSE-A' },
    credits: { type: Number, required: true, default: 3 },
    facultyUserId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Course = (mongoose.models.Course as mongoose.Model<ICourse>) || mongoose.model<ICourse>('Course', CourseSchema);
