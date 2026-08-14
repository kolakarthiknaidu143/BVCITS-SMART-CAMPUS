import mongoose, { Schema, Document } from 'mongoose';

export interface IMarks extends Document {
  studentUserId: mongoose.Types.ObjectId;
  subject: string;
  examType: 'Mid1' | 'Mid2' | 'Internal' | 'Semester';
  marksObtained: number;
  maxMarks: number;
  facultyUserId: mongoose.Types.ObjectId;
}

const MarksSchema: Schema = new Schema(
  {
    studentUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    examType: { type: String, enum: ['Mid1', 'Mid2', 'Internal', 'Semester'], required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, required: true, default: 100 },
    facultyUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Marks = (mongoose.models.Marks as mongoose.Model<IMarks>) || mongoose.model<IMarks>('Marks', MarksSchema);
